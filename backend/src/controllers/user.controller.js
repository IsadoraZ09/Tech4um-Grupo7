import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"; 


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "segredo_temporario_tech4um", {
    expiresIn: "1d", // Token vale por 1 dia
  });
};

// --- CADASTRO ---
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validação básica
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // 2. Verifica duplicidade
    if (await User.findOne({ email }))
      return res.status(400).send({ error: "Este e-mail já está cadastrado." });

    if (await User.findOne({ username }))
      return res.status(400).send({ error: "Este nome de usuário já está em uso." });

    // 3. Cria usuário
    const user = await User.create({
      username,
      email,
      password, // O Model vai criptografar isso sozinho
    });

    // 4. Retorna Sucesso + TOKEN
    res.status(201).json({
      message: "Usuário registrado com sucesso.",
      user: { id: user._id, email: user.email, username: user.username },
      token: generateToken(user._id), // <--- ONDE A MÁGICA ACONTECE
    });

  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário.", error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha inválida." });
    }

    res.status(200).json({
      message: "Login realizado com sucesso.",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token: generateToken(user._id), 
    });

  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login.", error: error.message });
  }
};

const logoutUser = async (req, res) => {
    res.status(200).json({ message: "Logout realizado com sucesso." });
};

export { registerUser, loginUser, logoutUser };