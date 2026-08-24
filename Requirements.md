
# PoC Full Stack — Comparación REST vs GraphQL con .NET, Node.js, Angular, React y MVC

Actúa como **Software Architect + Senior Full Stack Developer** y construye un proyecto PoC completo, funcional y ejecutable localmente.

El objetivo principal de este proyecto es **demostrar de forma práctica las diferencias, ventajas y casos de uso de REST API vs GraphQL**, utilizando el mismo dominio de negocio y la misma base de datos, pero exponiéndolo mediante diferentes backends y consumiéndolo desde diferentes frontends.

No es un proyecto productivo ni se requiere implementar seguridad avanzada. Es un **Dummy / Proof of Concept**, pero debe tener una estructura profesional, limpia, mantenible y fácil de estudiar.

---

## 1. Objetivo general

Crear una solución monorepo que contenga:

### Backends

1. **.NET Web API + REST**
2. **.NET + GraphQL**
3. **Node.js API REST**
4. **Node.js + GraphQL**

### Frontends

5. **Angular**

   * Consumir REST API
   * Consumir GraphQL

6. **React**

   * Consumir REST API
   * Consumir GraphQL

7. **ASP.NET MVC**

   * Consumir REST API
   * Consumir GraphQL

### Infraestructura

8. **MongoDB**
9. **Docker Compose** para levantar MongoDB
10. Documentación para ejecutar todo localmente.

Todo debe convivir dentro de **un mismo proyecto/repository**.

---

# 2. Dominio de negocio

Utiliza un dominio sencillo pero suficientemente interesante para demostrar relaciones complejas.

Se propone construir un pequeño sistema de **Gestión de Proyectos / Work Management**.

Entidades principales:

* Customer
* Project
* Team
* User
* Task
* Tag
* Comment

Relaciones sugeridas:

```text
Customer
   |
   +---- Projects
             |
             +---- Teams
             |       |
             |       +---- Users
             |
             +---- Tasks
                     |
                     +---- Assigned User
                     |
                     +---- Tags
                     |
                     +---- Comments
```

Las relaciones deben ser suficientemente complejas para demostrar escenarios donde GraphQL sea útil.

Por ejemplo:

```text
Customer
  -> Projects
      -> Tasks
          -> AssignedUser
          -> Tags
          -> Comments
      -> Teams
          -> Users
```

---

# 3. Casos de uso que debe soportar el CRUD

Implementar CRUD para las entidades principales.

Como mínimo:

* Crear
* Obtener uno
* Obtener lista
* Actualizar
* Eliminar

Agregar búsquedas y filtros simples cuando tenga sentido.

Ejemplos:

```text
GET /api/projects

GET /api/projects/{id}

POST /api/projects

PUT /api/projects/{id}

DELETE /api/projects/{id}
```

---

# 4. El punto importante del PoC: REST vs GraphQL

No quiero simplemente dos implementaciones equivalentes.

El proyecto debe estar diseñado para **demostrar visualmente y técnicamente por qué GraphQL puede ser beneficioso cuando existen relaciones complejas**.

Crear escenarios como:

### Escenario REST

Para obtener:

```text
Customer
  -> Projects
      -> Tasks
          -> AssignedUser
          -> Tags
      -> Teams
          -> Users
```

probablemente sea necesario realizar múltiples requests.

Por ejemplo:

```text
GET /customers/{id}

GET /customers/{id}/projects

GET /projects/{id}/tasks

GET /tasks/{id}/assigned-user

GET /tasks/{id}/tags

GET /projects/{id}/teams

GET /teams/{id}/users
```

Demostrar este problema.

---

### Escenario GraphQL

Permitir obtener toda la información necesaria mediante una única query:

```graphql
query {
  customer(id: "...") {
    id
    name
    projects {
      id
      name
      tasks {
        id
        title
        status
        assignedUser {
          id
          name
        }
        tags {
          id
          name
        }
        comments {
          id
          text
        }
      }
      teams {
        id
        name
        users {
          id
          name
        }
      }
    }
  }
}
```

El proyecto debe demostrar claramente:

* Over-fetching
* Under-fetching
* Múltiples requests REST
* Una query GraphQL
* Selección exacta de campos
* Relaciones anidadas
* Filtros
* Paginación
* Diferencia entre REST y GraphQL

---

# 5. MongoDB

Utilizar:

**MongoDB**

No utilizar SQL Server, PostgreSQL, MySQL ni otra base de datos.

Crear:

```text
docker-compose.yml
```

que permita levantar MongoDB fácilmente.

Ejemplo conceptual:

```bash
docker compose up -d
```

La configuración debe incluir:

* MongoDB
* Persistencia mediante volume
* Puerto configurable mediante environment variables
* Database configurable mediante environment variables

No es necesario implementar MongoDB Atlas.

---

# 6. Modelo MongoDB

Diseñar el modelo pensando en MongoDB.

No realizar simplemente una traducción directa de un modelo relacional.

Analizar cuáles entidades conviene mantener como documentos separados y cuáles relaciones deben resolverse mediante referencias.

Documentar brevemente las decisiones.

Por ejemplo:

```text
customers
projects
teams
users
tasks
tags
comments
```

Utilizar IDs consistentes.

---

# 7. Backend .NET

Crear un backend moderno utilizando **ASP.NET Core Web API**.

Debe exponer:

### REST

```text
/api/customers
/api/projects
/api/teams
/api/users
/api/tasks
/api/tags
/api/comments
```

### GraphQL

Exponer un endpoint:

```text
/graphql
```

Utilizar una implementación GraphQL adecuada para .NET.

Preferentemente utilizar:

**Hot Chocolate**

pero si existe una razón técnica para utilizar otra alternativa, documentarla.

---

# 8. Backend Node.js

Crear un segundo backend completamente independiente.

Utilizar:

* Node.js
* TypeScript
* API REST
* GraphQL

Preferentemente utilizar:

* Fastify o Express para REST
* Apollo Server, Mercurius u otra solución GraphQL madura

Elegir una combinación coherente y documentar la decisión.

Endpoints:

```text
/api/customers
/api/projects
/api/teams
/api/users
/api/tasks
/api/tags
/api/comments
```

GraphQL:

```text
/graphql
```

---

# 9. Regla importante: mismos datos y mismo comportamiento

Los backends .NET y Node.js deben utilizar **la misma instancia de MongoDB**.

No crear bases de datos independientes.

Ambos backends deben poder consultar los mismos datos.

La idea es poder comparar:

```text
.NET REST
.NET GraphQL

vs

Node REST
Node GraphQL
```

sobre exactamente el mismo dominio.

---

# 10. Frontend Angular

Crear una aplicación Angular profesional pero sencilla.

Debe permitir seleccionar/visualizar:

```text
REST
GraphQL
```

Debe implementar pantallas para:

* Customers
* Projects
* Tasks
* Teams
* Users
* Tags
* Comments

Crear al menos un dashboard donde se pueda navegar:

```text
Customer
  -> Projects
      -> Tasks
          -> Users
          -> Tags
          -> Comments
      -> Teams
          -> Users
```

Implementar dos clientes:

```text
REST Client
GraphQL Client
```

No mezclar las dos estrategias.

---

# 11. Frontend React

Crear una aplicación React utilizando TypeScript.

Debe consumir:

```text
REST API
GraphQL
```

Implementar las mismas funcionalidades principales de Angular.

El objetivo es que podamos comparar:

```text
Angular + REST
Angular + GraphQL

React + REST
React + GraphQL
```

---

# 12. Frontend ASP.NET MVC

Crear una aplicación ASP.NET MVC que consuma remotamente los backends.

No utilizar acceso directo a MongoDB desde MVC.

MVC debe actuar como cliente.

Debe consumir:

```text
REST
GraphQL
```

Implementar al menos:

* Customer list
* Customer detail
* Project detail
* Task list
* Relaciones entre entidades

Mostrar claramente cómo MVC consulta GraphQL.

---

# 13. Arquitectura

Organizar el repository como monorepo.

Una estructura sugerida:

```text
poc-graphql-crud/
│
├── README.md
│
├── docker-compose.yml
│
├── docs/
│   ├── architecture.md
│   ├── graphql-vs-rest.md
│   ├── mongodb-model.md
│   └── api-examples.md
│
├── infrastructure/
│   └── mongodb/
│
├── backend/
│   │
│   ├── dotnet/
│   │   ├── src/
│   │   └── tests/
│   │
│   └── node/
│       ├── src/
│       └── tests/
│
├── frontend/
│   │
│   ├── angular/
│   ├── react/
│   └── mvc/
│
└── scripts/
    ├── seed/
    └── setup/
```

Puedes modificar esta estructura si encuentras una arquitectura mejor, pero debe mantenerse la separación clara entre:

* Infrastructure
* Backend
* Frontend
* Tests
* Documentation

---

# 14. Seed de datos

Crear un mecanismo para insertar datos de prueba automáticamente.

Debe generar suficientes relaciones para demostrar GraphQL.

Por ejemplo:

```text
5 Customers

Cada Customer:
  3 Projects

Cada Project:
  2 Teams
  10 Tasks

Cada Task:
  1 Assigned User
  2-4 Tags
  1-5 Comments
```

Los datos deben ser coherentes.

Crear un script:

```text
seed
```

que pueda ejecutarse fácilmente.

Por ejemplo:

```bash
npm run seed
```

o equivalente para .NET.

---

# 15. GraphQL

El schema GraphQL debe demostrar:

### Queries

```graphql
customers
customer(id: ID!)

projects
project(id: ID!)

tasks
task(id: ID!)
```

### Mutations

```graphql
createCustomer
updateCustomer
deleteCustomer

createProject
updateProject
deleteProject

createTask
updateTask
deleteTask
```

Implementar relaciones navegables.

Por ejemplo:

```graphql
customer {
    projects {
        tasks {
            assignedUser
            tags
            comments
        }
    }
}
```

---

# 16. Filtros

Implementar filtros útiles.

Ejemplo:

```graphql
tasks(
  status: "InProgress"
  projectId: "..."
)
```

o una estructura equivalente.

También demostrar cómo realizar filtros sobre entidades relacionadas cuando sea razonable.

---

# 17. Paginación

Implementar paginación en GraphQL.

Preferentemente demostrar una estrategia estándar como:

```text
offset/limit
```

o:

```text
cursor-based pagination
```

No es necesario implementar una solución extremadamente compleja.

Documentar la decisión.

---

# 18. Comparación REST vs GraphQL

Crear una sección específica en el README con ejemplos reales.

Debe explicar:

### REST

```text
Request 1
Request 2
Request 3
Request 4
...
```

vs.

### GraphQL

```text
Una query
```

Mostrar:

* Cantidad de requests
* Cantidad de datos devueltos
* Over-fetching
* Under-fetching
* Nested queries
* Flexibilidad del cliente

No inventar benchmarks.

Si se realizan mediciones, deben ser reales y reproducibles.

---

# 19. UI para demostrar el concepto

No necesito un diseño visual complejo.

Pero sí quiero una UI suficientemente profesional para demostrar el concepto.

Crear una sección:

```text
REST vs GraphQL
```

donde sea posible seleccionar:

```text
Customer
Project
Task
```

y visualizar los datos relacionados.

Idealmente mostrar:

```text
REST

Requests:
7

Endpoints:
...
```

y:

```text
GraphQL

Requests:
1

Query:
...
```

Si implementar esto requiere demasiado trabajo, al menos dejar ejemplos claramente documentados.

---

# 20. Calidad de código

Aunque sea un PoC, quiero calidad de código.

Aplicar:

* SOLID cuando tenga sentido
* Separation of Concerns
* Dependency Injection
* DTOs
* Services
* Repositories cuando realmente aporten valor
* Validaciones
* Manejo consistente de errores
* Logging
* Configuration mediante environment variables
* Async/await
* TypeScript strict mode
* Nullable reference types en .NET
* Evitar código duplicado
* Nombres claros
* Métodos pequeños
* Responsabilidades bien separadas

No aplicar patrones artificialmente solo para hacer el proyecto más grande.

---

# 21. Tests

Crear pruebas mínimas pero útiles.

### .NET

Unit tests para servicios importantes.

Integration tests para algunos endpoints.

### Node.js

Unit tests para servicios/resolvers importantes.

Integration tests para algunos endpoints.

### GraphQL

Al menos algunos tests para queries y mutations.

No es necesario alcanzar 100% de coverage.

Priorizar pruebas que demuestren comportamiento importante.

---

# 22. Manejo de errores

Implementar respuestas consistentes.

REST debe devolver HTTP status codes apropiados.

Ejemplo:

```text
200
201
204
400
404
500
```

GraphQL debe manejar errores correctamente según el estándar.

No exponer stack traces innecesariamente.

---

# 23. Seguridad

La seguridad **NO es prioridad en esta PoC**.

No implementar:

* OAuth
* OpenID Connect
* JWT complejo
* Roles
* Identity
* MFA

Sin embargo:

* No hardcodear passwords.
* No hardcodear secrets.
* Utilizar environment variables.
* Mantener buenas prácticas básicas.

Documentar explícitamente:

> Security is intentionally out of scope for this Proof of Concept.

---

# 24. Docker

Crear:

```text
docker-compose.yml
```

como mínimo para MongoDB.

Opcionalmente puedes incluir otros servicios si aportan valor.

Pero evita complicar innecesariamente la PoC.

La solución debe poder ejecutarse fácilmente desde una máquina de desarrollo.

---

# 25. Configuración

Todas las URLs deben ser configurables.

Ejemplo:

```text
MONGODB_CONNECTION_STRING
MONGODB_DATABASE

DOTNET_API_URL
DOTNET_GRAPHQL_URL

NODE_API_URL
NODE_GRAPHQL_URL
```

Los frontends deben poder cambiar fácilmente el backend utilizado.

No hardcodear URLs dispersas por el código.

---

# 26. Documentación

Crear un README profesional que explique:

## 1. Overview

Qué intenta demostrar la PoC.

## 2. Architecture

Diagrama textual de arquitectura.

## 3. Technologies

Lista de tecnologías utilizadas.

## 4. Requirements

Qué necesito instalado.

## 5. Running MongoDB

```bash
docker compose up -d
```

## 6. Seed

Cómo cargar datos.

## 7. Running .NET

Comandos exactos.

## 8. Running Node.js

Comandos exactos.

## 9. Running Angular

Comandos exactos.

## 10. Running React

Comandos exactos.

## 11. Running MVC

Comandos exactos.

## 12. REST examples

Agregar ejemplos de requests.

## 13. GraphQL examples

Agregar queries y mutations reales.

## 14. REST vs GraphQL

Explicar los beneficios observados.

## 15. Project limitations

Documentar qué NO está implementado.

---

# 27. GraphQL Playground / IDE

Configurar una herramienta que permita explorar GraphQL fácilmente.

Por ejemplo:

```text
/graphql
```

y habilitar una interfaz de exploración compatible con la implementación seleccionada, cuando corresponda.

La idea es que un desarrollador pueda abrir el endpoint y experimentar con queries.

---

# 28. CORS

Configurar CORS para permitir que Angular y React puedan consumir los backends durante desarrollo.

No realizar una configuración excesivamente restrictiva en esta PoC.

Documentar claramente la configuración.

---

# 29. API Documentation

Para REST utilizar Swagger/OpenAPI.

Debe ser posible abrir Swagger y probar:

```text
GET
POST
PUT
DELETE
```

directamente.

Documentar también GraphQL.

---

# 30. Criterios de aceptación

El proyecto se considera terminado cuando:

* MongoDB levanta mediante Docker Compose.
* Los datos de ejemplo pueden ser cargados mediante seed.
* .NET REST funciona.
* .NET GraphQL funciona.
* Node REST funciona.
* Node GraphQL funciona.
* Angular consume REST.
* Angular consume GraphQL.
* React consume REST.
* React consume GraphQL.
* MVC consume REST.
* MVC consume GraphQL.
* Todos utilizan la misma MongoDB.
* Las entidades tienen relaciones reales.
* GraphQL permite navegar relaciones anidadas.
* Existen ejemplos claros donde REST requiere múltiples requests.
* Existe un ejemplo equivalente mediante una sola query GraphQL.
* Existen CRUDs básicos.
* Existen filtros.
* Existe paginación.
* Existen tests básicos.
* Existe documentación.
* El código está organizado profesionalmente.
* No existen secretos hardcodeados.
* El proyecto puede ejecutarse localmente siguiendo únicamente el README.

---

# 31. Regla importante para la implementación

No generes una solución artificialmente compleja.

El objetivo NO es construir un sistema empresarial.

El objetivo es construir una **PoC educativa y profesional** que permita a un desarrollador entender:

```text
REST vs GraphQL
```

y especialmente:

```text
¿Por qué GraphQL puede ser útil cuando existen relaciones complejas
y diferentes clientes necesitan diferentes estructuras de datos?
```

Prioriza:

1. Claridad
2. Arquitectura
3. Código limpio
4. Funcionamiento
5. Comparabilidad
6. Documentación
7. Facilidad de ejecución

sobre features innecesarias.

---

# 32. Entregables

Al finalizar debes entregar:

```text
1. Código fuente completo
2. docker-compose.yml
3. Seed de MongoDB
4. Backend .NET REST
5. Backend .NET GraphQL
6. Backend Node REST
7. Backend Node GraphQL
8. Frontend Angular
9. Frontend React
10. Frontend ASP.NET MVC
11. Tests
12. Swagger/OpenAPI
13. GraphQL schema
14. Ejemplos de queries/mutations
15. README.md
16. Documentación REST vs GraphQL
```

---

# 33. Forma de trabajo

Antes de generar todo el código:

1. Analiza los requerimientos.
2. Propón la arquitectura.
3. Propón la estructura de carpetas.
4. Define el modelo de dominio.
5. Define el modelo MongoDB.
6. Define el GraphQL schema.
7. Define los endpoints REST.
8. Define cómo se conectarán los tres frontends.
9. Define el flujo de ejecución local.
10. Explica brevemente las decisiones técnicas.

Después de validar mentalmente la arquitectura, implementa la solución completa.

Si encuentras una decisión técnica ambigua, **elige la opción más simple, mantenible y estándar**, documentando la decisión en lugar de detener el desarrollo.

No preguntes innecesariamente por detalles menores.

---

# 34. Resultado esperado

Quiero terminar con un proyecto que permita ejecutar una demostración como esta:

```text
                 ┌───────────────────┐
                 │     MongoDB       │
                 │     Docker        │
                 └─────────┬─────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
       ┌─────▼─────┐               ┌─────▼─────┐
       │  .NET     │               │  Node.js  │
       │ REST      │               │ REST      │
       │ GraphQL   │               │ GraphQL   │
       └─────┬─────┘               └─────┬─────┘
             │                           │
       ┌─────┴───────────────┬───────────┴─────┐
       │                     │                 │
 ┌─────▼─────┐         ┌─────▼─────┐    ┌────▼────┐
 │ Angular   │         │   React   │    │   MVC   │
 │ REST      │         │ REST      │    │ REST    │
 │ GraphQL   │         │ GraphQL   │    │ GraphQL │
 └───────────┘         └───────────┘    └─────────┘
```

Y que exista un caso demostrativo concreto como:

```text
Customer
  └── Projects
       ├── Teams
       │    └── Users
       │
       └── Tasks
            ├── Assigned User
            ├── Tags
            └── Comments
```

donde se pueda comparar claramente:

```text
REST:
múltiples endpoints / múltiples requests

vs.

GraphQL:
una query / estructura exactamente definida por el cliente
```

El resultado debe ser un **laboratorio práctico de GraphQL vs REST**, no solamente un conjunto de CRUDs.

---

# 35. Microservicio de notificaciones por email (gRPC)

Agregar un microservicio nuevo, independiente de `WorkApi`, que simule el envío de correos y se comunique con `WorkApi` vía **gRPC** (el estándar moderno para comunicación entre backends, en lugar de otro REST/GraphQL interno).

## 1. NotificationService

- Proyecto ASP.NET Core separado: `backend/dotnet/src/NotificationService` (net8.0, `Grpc.AspNetCore`).
- Sin base de datos, sin estado — no persiste nada.
- Sin configuración de envío real (sin SMTP host, sin API key) — de momento el envío es **simulado**: solo loguea `"Simulated email sent to {to}: {subject}"` y responde un ack.
- Corre como recurso propio dentro del Aspire AppHost (`notifications`), puerto propio, gRPC sobre HTTP plano (sin TLS, consistente con el resto de la PoC).

## 2. Contrato gRPC

Un solo método genérico, reutilizado para cualquier tipo de correo (el dominio del mensaje lo arma quien llama, no el microservicio):

```proto
service EmailNotifier {
  rpc SendEmail (SendEmailRequest) returns (SendEmailAck);
}
message SendEmailRequest { string to = 1; string subject = 2; string body = 3; }
message SendEmailAck { bool accepted = 1; string messageId = 2; }
```

## 3. Integración con WorkApi

`WorkApi` es el único backend que le habla a `NotificationService` (Node.js queda sin tocar en esta etapa). Cliente gRPC generado a partir del mismo `.proto`, referenciado directamente desde `WorkApi.csproj`.

Un correo se dispara en estos eventos:

- **Tarea asignada**: al crear una Task con `assignedUserId`, o al actualizar una Task y el `assignedUserId` cambia a un usuario distinto.
- **Usuario creado**: bienvenida al crear un User.

La llamada gRPC nunca debe romper el request HTTP/GraphQL que la origina: se hace `await` sobre la llamada pero cualquier excepción se captura y solo se loguea, nunca se propaga.

## 4. Datos de prueba (seed)

Los emails de los usuarios sembrados en `scripts/seed/seed.js` deben usar el dominio de **Mailinator** (`@mailinator.com`) en lugar de `@example.com`, para poder revisar en una inbox pública real durante pruebas manuales. Los emails de `customers` no cambian (no reciben notificaciones en este alcance).
