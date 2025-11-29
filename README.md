markdown
// filepath: /home/victor/Documentos/EStágio/Tech4um-Grupo7/README.md
# Tech4um Forum

Forum simples para criação e visualização de tópicos e interações entre usuários, com frontend em React e backend em Node.js + Express + MongoDB (Mongoose).

## Stack
- Frontend: React (Vite) + CSS Modules
- Backend: Node.js, Express, Mongoose
- Banco: MongoDB
- Gerenciamento: GitHub

## Decisões Técnicas
- React e Node escolhidos por familiaridade e curva de aprendizado reduzida.
- Padronização de pastas para facilitar manutenção e escalabilidade.
- CSS Modules para isolamento de estilos e evitar conflitos globais.
- MongoDB + Mongoose pela experiência prévia e material de apoio.
- Separação clara entre client (interface) e server (API).

## Estrutura (resumida)
/client  
  /src  
    /components  
    /screens  
    /contexts
    /services (chamadas à API)  

/server  
  /src  
    /models  
    /routes  
    /controllers  
    /features (conexão Mongo)  

## Pré-requisitos
- Node.js LTS
- MongoDB em execução local ou URI na nuvem
- npm

## Instalação
Na raiz do projeto:
1. Instalar dependências:
   - cd server && npm install
   - cd ../client && npm install
2. Configurar variáveis de ambiente (exemplo em server):
   - Criar .env com:  
    DB_PASSWORD="secret"
    MONGO_URI=mongodb://localhost:27017/tech4um
    NODE_ENV="development"
    JWT_SECRET = 'secret'
    JWT_EXPIRES = '10d'
    JWT_COOKIE_EXPIRES = '5'

## Execução
Em dois terminais:
Terminal 1 (API):
- cd server
- npm start

Terminal 2 (Frontend):
- cd client
- npm run dev

Acesse o frontend (porta padrão Vite, ex: http://localhost:5173) e o backend (ex: http://localhost:3000).

## Scripts Úteis
Server:
- npm start (inicia API)
Client:
- npm run dev (desenvolvimento)
- npm run build (build de produção)

## Fluxo Básico
1. Usuário acessa frontend.
2. Frontend chama API para listar tópicos.
3. Criação/edição envia requisições REST para o backend.
4. Backend persiste dados via Mongoose no MongoDB.
5. Respostas retornam em JSON.

## Contribuidores
- Victor: estrutura de pastas, hierarquia, backend completo, integração front-back.
- Isadora: organização inicial (GitHub, estilização), telas do frontend, separação inicial de componentes.
