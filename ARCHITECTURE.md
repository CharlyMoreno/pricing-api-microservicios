# Servicio Pricing

## Descripción

El microservicio de **Pricing** gestiona los precios de un catálogo, genera políticas de descuentos, maneja precios especiales, cupones y descuentos, y permite consultar precios para el proceso de compras. También notifica cambios de precios de forma asíncrona a otros servicios, como **Stats**.

## Modelo de Datos

### Price
```json
{
	"id": string,
	"productId": string,
	"basePrice": number,
	"discount": number (optional),
	"specialPrice": number (optional),
	"finalPrice": number,
	"currency": string,
	"createdAt": number (timestamp),
	"updatedAt": number (timestamp)
}
```

### Discount Policy
```json
{
	"id": string,
	"policyName": string,
	"description": string,
	"discountPercentage": number,
	"active": boolean,
	"validFrom": number (timestamp),
	"validUntil": number (timestamp)
}
```

### Coupon
```json
{
	"id": string,
	"code": string,
	"discountPercentage": number,
	"expirationDate": number (timestamp),
	"appliesTo": [ "category" | "product" ]
}
```

## API

### Crear Precio

`POST /pricing`

Permite agregar un nuevo precio para un producto.

#### Body
```json
{
	"productId": string,
	"basePrice": number,
	"currency": string
}
```

#### Descripción:
- `productId`: ID del producto al que se le asigna el precio.
- `basePrice`: Precio base del producto.
- `currency`: Moneda en la que está expresado el precio (por ejemplo, USD, EUR).

#### Respuesta
```json
{
	"message": "Price created successfully",
	"priceId": string
}
```

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

### Consultar Precio de Producto

`GET /pricing/:productId`

Devuelve el precio actual de un producto específico.

#### Respuesta
```json
{
	"productId": string,
	"basePrice": number,
	"discount": number,
	"specialPrice": number,
	"finalPrice": number,
	"currency": string
}
```

#### Errores
- Devuelve `404` si el producto no tiene un precio registrado.

### Modificar Precio

`PUT /pricing/:id`

Permite modificar el precio base, precio especial o descuento de un producto.

#### Body
```json
{
	"basePrice": number (optional),
	"specialPrice": number (optional),
	"discount": number (optional),
	"currency": string
}
```

#### Respuesta
```json
{
	"message": "Price updated successfully",
	"priceId": string
}
```

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

### Crear Política de Descuento

`POST /pricing/policy`

Permite crear una política de descuentos global para productos o categorías.

#### Body
```json
{
	"policyName": string,
	"description": string,
	"discountPercentage": number,
	"validFrom": number (timestamp),
	"validUntil": number (timestamp)
}
```

#### Respuesta
```json
{
	"message": "Discount policy created successfully",
	"policyId": string
}
```

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

### Aplicar Cupón de Descuento

`POST /pricing/coupon`

Permite aplicar un cupón a un producto o categoría.

#### Body
```json
{
	"code": string,
	"productId": string,
	"categoryId": string (optional)
}
```

#### Respuesta
```json
{
	"message": "Coupon applied successfully",
	"discountApplied": number
}
```

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

### Consultar Precios para Proceso de Compras

`GET /pricing/shopping`

Este endpoint devuelve una lista de precios para varios productos, con sus descuentos aplicados, si corresponde, para ser utilizada en el proceso de compras.

#### Body
```json
{
	"productIds": [string]
}
```

#### Respuesta
```json
[
	{
		"productId": string,
		"finalPrice": number,
		"discount": number,
		"currency": string
	}
]
```

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

## Interfaz RabbitMQ para Notificaciones de Precios

Este servicio se suscribe a un canal de RabbitMQ para notificar de forma asíncrona los cambios en los precios, como nuevas asignaciones o actualizaciones de precios, a servicios externos como **Stats**.

- **Cola RabbitMQ**: `price_notification_queue`

#### Mensaje de Notificación
```json
{
	"productId": string,
	"basePrice": number,
	"finalPrice": number,
	"currency": string,
	"updatedAt": number (timestamp)
}
```

#### Descripción:
- `productId`: ID del producto cuyo precio ha sido modificado.
- `basePrice`: Precio base del producto.
- `finalPrice`: Precio final con descuentos aplicados.
- `currency`: Moneda en la que está expresado el precio.
- `updatedAt`: Timestamp de la última actualización.

#### Flujo del Mensaje:
1. Cuando se crea o modifica un precio, se envía una notificación a la cola de RabbitMQ.
2. Los servicios interesados, como **Stats**, consumen esta información para actualizar sus métricas o informes.

#### Respuesta Esperada
- **Mensaje en cola RabbitMQ de éxito**: Indica que el precio fue notificado correctamente.
```json
{
	"status": "notified",
	"productId": string
}
```

- **Mensaje en cola RabbitMQ de error**: Si falla la notificación, se publica un mensaje con el estado `failed`.
```json
{
	"status": "failed",
	"error": string,
	"productId": string
}
```

## API Adicional

### Consultar Políticas de Descuento

`GET /pricing/policy`

Devuelve una lista de políticas de descuento activas.

#### Respuesta
```json
[
	{
		"id": string,
		"policyName": string,
		"description": string,
		"discountPercentage": number,
		"validFrom": number,
		"validUntil": number
	}
]
```

### Consultar Cupón

`GET /pricing/coupon/:code`

Devuelve los detalles de un cupón por su código.

#### Respuesta
```json
{
	"id": string,
	"code": string,
	"discountPercentage": number,
	"expirationDate": number,
	"appliesTo": [ "category" | "product" ]
}
```

#### Errores
- Devuelve `404` si el cupón no existe.