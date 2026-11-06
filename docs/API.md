# Petshop API

Base URL local: `http://localhost:9090`

## Pets

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pets` | List pets |
| GET | `/api/pets/{id}` | Get one pet |
| POST | `/api/pets` | Create pet |
| PUT | `/api/pets/{id}` | Update pet |
| DELETE | `/api/pets/{id}` | Delete pet |

Example POST body:

```json
{
  "name": "Luna",
  "species": "Cat",
  "breed": "British Shorthair",
  "price": 3500000,
  "imageUrl": "",
  "description": "Friendly indoor cat",
  "available": true
}
```

## Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |

Example POST body:

```json
{
  "customerName": "Nguyen Van A",
  "petId": 1,
  "quantity": 1
}
```

## Health

`GET /actuator/health`
