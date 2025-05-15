# Book Management API – Praktika 3. Backend
**Autor:** tKozuhhar<br>
**Kursus:** Veebiprogrammeerimine<br>

## Projekti kirjeldus
Tegemist on RESTful API-ga raamatute haldamiseks, mis on loodud Praktika 3 jaoks. Rakendus kasutab **JWT autentimist** ja toetab **kasutajarolle**: Admin ja User. Admin saab muuta ja kustutada raamatuid. User saab vaadata raamatuid ja lisada kommentaare. Kõik tegevused logitakse süsteemi, et tagada jälgitavus ja turvalisus.

Kasutatud tehnoloogiad:
- **Node.js** + **Express.js** (serveri loogika)
- **Sequelize ORM** + **MSSQL** (andmebaasi haldus)
- **JWT** (jsonwebtoken, autentimine)
- **bcryptjs** (paroolide krüpteerimine)
- **dotenv** (keskkonnamuutujate haldus)
- **axios** (HTTP-päringute tegemiseks)

Projekti struktuur:
- config/         # Andmebaasi ühenduse seaded
- middleware/     # Autentimine, autoriseerimine ja logimine
- models/         # Sequelize andmemudelid
- routes/         # API endpointid
- server.js       # Rakenduse käivitusfail
- .env            # Keskkonnamuutujad (on vaja luua)
- activity.log    # Logifail (ilmub pärast käivitamist)
- README.md       # Dokumentatsioon

Vastavus ülesande nõuetele:
- RESTful API raamatute haldamiseks
- JWT autentimine ja autoriseerimine
- Kasutajate rollid: Admin ja User
- Admin saab muuta ja kustutada raamatuid
- User saab vaadata raamatuid ja lisada kommentaare
- Tegevuste logimine (logimine Middleware kaudu)
- API dokumentatsioon (käsitsi lisatud README-sse)
- Projekt GitHub'is koos README failiga

## INSTALLIMA. Kuidas käivitada
Lae projekt alla https://github.com/tKozuhhar/Praktika3_tKozuhhar <br>
Paigaldakse Node.js (LTS) järgmiselt lingilt: https://nodejs.org/en <br>
LTS (Long Term Support) on stabiilne versioon pikaajalise toega. Soovitatav enamiku kasutajate jaoks.<br>
Pärast seda paigalda SQL Server, kui seda ei ole, ja paketid projektis: <br>
`npm install express` <br>
`npm install sequelize` <br>
`npm install mssql` <br>
`npm install jsonwebtoken` <br>
`npm install bcryptjs` <br>
`npm install axios` <br>
`npm install dotenv` <br>

Loo ".env" fail järgmine sisuga: <br>
`DB_HOST = localhost` <br>
`DB_PORT = your_db_port` <br>
`DB_NAME = raamatud` <br>
`DB_USER = your_db_user` <br>
`DB_PASSWORD = your_db_password` <br>
`JWT_SECRET = salajane_sone` <br>
`PORT = 3000` <br>

Pärast seda kasutatakse käsk: <br>
`node server.js` <br>
(Serveri aadress - `http://localhost:3000/`) <br>

## Autentimine
Autentimine toimub JWT tokeni abil. Kasutaja saab tokeni sisselogimisel ja peab selle lisama iga kaitstud päringusse Authorization päisesse kujul:<br>
`Authorization: Bearer <token>` <br>

## API Endpointide dokumentatsioon
| **Meetod** | **URL**               | **Kirjeldus**                    | **Ligipääs** |
|--------|---------------------------|----------------------------------|--------------|
| POST   | `/auth/register`          | Registreeri uus kasutaja         | Avalik       |
| POST   | `/auth/login`             | Sisselogimine (tagastab JWT)     | Avalik       |
| GET    | `/books`                  | Kõikide raamatute nimekiri       | Avalik       |
| GET    | `/books/:id`              | Vaata konkreetset raamatut       | Avalik       |
| PUT    | `/books/:id`              | Muuda raamatu andmeid            | Admin        |
| DELETE | `/books/:id`              | Kustuta raamat                   | Admin        |
| POST   | `/comments/:id`           | Lisa kommentaar raamatu juurde   | User         |
| GET    | `/comments/:id`           | Vaata raamatu kommentaarid       | User         |

### Registreerimine näite
POST /auth/register <br>
Luuakse uus kasutaja.<br>

Keha (JSON):<br>
{<br>
  "username": "kasutaja1",<br>
  "password": "salasona",<br>
  "role": "User"<br>
}<br>

Vastus:<br>
{<br>
  {"message":"Пользователь создан","userId":3}<br>
}<br>

### Sisselogimine näite
POST /auth/login<br>
Tagastab JWT tokeni.<br>

Keha:<br>
{<br>
  "username": "kasutaja1",<br>
  "password": "salasona"<br>
}<br>

Vastus:<br>
{<br>
  "token": "<jwt-token>"<br>
}<br>

### Raamatute vaatamine (avalik) näite
GET /books<br>
Tagastab kõik raamatud.<br>
Kaitstud! Vaja JWT tokenit.<br>

Vastus:<br>
[<br>
{<br>
  "id": 1,<br>
  "title": "Raamatu pealkiri",<br>
  "publicationYear": Aasta,<br>
  "categoryId": 1,<br>
  "Authors": [<br>
    {<br>
      "id": 1,<br>
      "firstName": "Eesnimi",<br>
      "lastName": "Perekonnanimi",<br>
      "BookAuthors": {<br>
        "createdAt": "2025-05-13T18:19:20.461Z",<br>
        "updatedAt": "2025-05-13T18:19:20.461Z",<br>
        "BookId": 1,<br>
        "AuthorId": 1<br>
      }<br>
    }
  ],<br>
  "Category": {<br>
    "categoryId": 1,<br>
    "name": "kategooria"<br>
  }<br>
},<br>
...<br>
]<br>

### Raamatu vaatamine ID alusel näite
GET /books/:id<br>
Tagastab konkreetse raamatu andmed.<br>
Kaitstud! Vaja JWT tokenit.<br>

Vastus:<br>
{<br>
  "id": 1,<br>
  "title": "Raamatu pealkiri",<br>
  "publicationYear": aasta,<br>
  "categoryId": 1,<br>
  "Authors": [<br>
    {<br>
      "id": 1,<br>
      "firstName": "Eesnimi",<br>
      "lastName": "Perekonnanimi",<br>
      "BookAuthors": {<br>
        "createdAt": "2025-05-13T18:19:20.461Z",<br>
        "updatedAt": "2025-05-13T18:19:20.461Z",<br>
        "BookId": 1,<br>
        "AuthorId": 1<br>
      }<br>
    }<br>
  ],<br>
  "Category": {<br>
    "categoryId": 1,<br>
    "name": "kategooria"<br>
  }<br>
}<br>

### Raamatu muutmine (Admin) näite
PUT /books/:id<br>
Kaitstud! Ainult Admin.<br>

Keha:<br>
{<br>
  "title": "Uus pealkiri",<br>
  "publicationYear": "Aasta",<br>
  "categoryId": "id"<br>
}<br>

Vastus:<br>
{<br>
  "id": 1,                
  "title": "Uus pealkiri",<br>
  "publicationYear": aasta,   
  "categoryId": id      
}<br>

### Raamatu kustutamine (Admin) näite
DELETE /books/:id<br>
Kaitstud! Ainult Admin.<br>

Vastus:<br>
{<br>
    "message":"Книга удалена"<br>
}<br>

### Kommentaari lisamine (User) näite
POST /comments/:bookId<br>
Kaitstud! Vaja JWT tokenit.<br>

Keha:<br>
{<br>
  "content": "Kommentaar"<br>
}<br>

Vastus:<br>
{<br>
  "id": commentId,     
  "content": kommentaar,       
  "userId": userId,         
  "bookId": bookId,         
  "createdAt": aeg,     
  "updatedAt": aeg       
}<br>

### Raamatu kommentaare vaatamine 
GET /comments/:bookId<br>
Kaitstud! Vaja JWT tokenit.<br>

Vastus:<br>
[<br>
  {<br>
    "id": 1,<br>
    "content": "Kommentaar",<br>
    "userId": userId,<br>
    "bookId": bookId,<br>
    "createdAt": "2025-05-13T18:20:08.973Z",<br>
    "updatedAt": "2025-05-13T18:20:08.973Z"<br>
  }<br>
]<br>

## Logimine
Kõik olulised tegevused (raamatu vaatamine/muutmine/kustutamine, kommentaari lisamine/vaatamine) logitakse faili activity.log. Logimine toimub middleware/logger.js kaudu.<br>

## Märkused
API ei paku veebiliidest; kõik päringud tuleb teha cURLi kaudu (CMD'is). Kui brauseris avatakse `http://localhost:3000/`, kuvatakse veateade `Cannot GET /`, kuna juur-URLile ei ole määratud vastust.<br>
Andmebaas töötab *Microsoft SQL Server Management Studio* peal.<br>

### cURLid päringute näited
Kasutaja registreerimine (user):<br>
`curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"username\":\"user1\",\"password\":\"user123\",\"role\":\"User\"}"`<br>

Admini registreerimine (admin):<br>
`curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"Admin\"}"`<br>

Kasutaja sisselogimine (user):<br>
`curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"user1\",\"password\":\"user123\"}"`<br>

Admini sisselogimine (admin):<br>
`curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"`<br>

Raamatute haldamine (kõikide raamatute vaatamine):<br>
`curl -X GET http://localhost:3000/books -H "Authorization: Bearer <token>"`<br>

Raamatute haldamine (raamatu vaatamine ID alusel):<br>
`curl -X GET http://localhost:3000/books/1 -H "Authorization: Bearer <token>"`<br>

Raamatute haldamine (raamatu muutmine - admin):<br>
`curl -X PUT http://localhost:3000/books/1 -H "Authorization: Bearer <admin_token>" -H "Content-Type: application/json" -d "{\"title\":\"Muudetud pealkiri\",\"publicationYear\":2025,\"categoryId\":2}"`<br>

Raamatute haldamine (raamatu kustutamine - admin):<br>
`curl -X DELETE http://localhost:3000/books/3 -H "Authorization: Bearer <admin_token>"`<br>

Raamatute haldamine (raamatu kustutamise katse - user, keelatud):<br>
`curl -X DELETE http://localhost:3000/books/4 -H "Authorization: Bearer <user_token>"`<br>

Kommentaaride vaatamine raamatu ID alusel:<br>
`curl -X GET http://localhost:3000/comments/1 -H "Authorization: Bearer <token>"`<br>

Kommentaari lisamine raamatu alla:<br>
`curl -X POST http://localhost:3000/comments/1 -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d "{\"content\":\"Väga huvitav raamat!\"}"`<br>
