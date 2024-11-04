# Servicio Pricing

## Descripción

El microservicio de **Pricing** gestiona los precios de un catálogo, genera políticas de descuentos, maneja precios especiales, cupones y descuentos, y permite consultar precios para el proceso de compras. También notifica cambios de precios de forma asíncrona a otros servicios, como **Stats**.

## Casos de Uso

### 1. Mantener Precios del Catálogo
- **Actor:** Administrador del sistema.
- **Descripción:** Permitir al administrador agregar, actualizar y eliminar precios de productos en el catálogo.

### 2. Generar Políticas de Descuentos
- **Actor:** Administrador del sistema.
- **Descripción:** Permitir la creación, actualización y eliminación de políticas de descuentos que se aplican a productos o categorías específicas.

### 3. Manejar Precios Especiales y Cupones
- **Actor:** Cliente.
- **Descripción:** Permitir a los clientes aplicar cupones y obtener precios especiales al momento de la compra.

### 4. Consultar Precios para el Proceso de Compras
- **Actor:** Cliente.
- **Descripción:** Permitir a los clientes consultar precios actuales de productos durante el proceso de compra.

### 5. Notificar Nuevos Precios
- **Actor:** Sistema de estadísticas.
- **Descripción:** Notificar de forma asíncrona a otros sistemas sobre cambios en los precios para su análisis y uso en reportes.

## Modelo de Datos

1. **Product**
   - `id`: string (Unique identifier for the product)
   - `name`: string (Name of the product)
   - `description`: string (Description of the product)
   - `price`: number (Current price of the product)
   - `category`: string (Category of the product)
   - `special_price`: number (Special price, if applicable)

2. **Discount**
   - `id`: string (Unique identifier for the discount)
   - `name`: string (Name of the discount)
   - `type`: string (Type of discount: percentage, fixed, etc.)
   - `value`: number (Value of the discount)
   - `active`: boolean (Indicates if the discount is active)
   - `start_date`: date (Start date of the discount)
   - `end_date`: date (End date of the discount)
   - `product_id`: string (ID of the associated product)

3. **Coupon**
   - `id`: string (Unique identifier for the coupon)
   - `code`: string (Coupon code)
   - `discount_id`: string (ID of the associated discount)
   - `active`: boolean (Indicates if the coupon is active)
   - `start_date`: date (Start date of the coupon)
   - `end_date`: date (End date of the coupon)


## API


### Consultar Precio de Producto

`GET /api/prices/{product_id}`

Devuelve el precio actual de un producto específico.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

#### Respuesta
```json
{
    "id": "123",
    "name": "Product A",
    "price": 100.00,
    "special_price": null,
    "discounts": []
}
```

#### Errores
- Devuelve `404` si el producto no tiene un precio registrado.

---

### Crear Precio de Producto

`POST /api/prices`

Crea el precio de un producto.

#### Cuerpo de Solicitud
```json
{
    "product_id": "123",
    "price": 100.00,
    "special_price": 90.00
}
```

#### Respuesta
```json
{
    "message": "Price updated successfully",
    "product_id": "123"
}
```

---

### Actualizar Precio de Producto

`PATCH /api/prices/{product_id}`

Actualiza el precio de un producto específico.

#### Cuerpo de Solicitud
```json
{
    "price": 95.00,
    "special_price": 85.00
}
```

#### Respuesta
```json
{
    "message": "Price updated successfully",
    "product_id": "123"
}
```
#### Errores
- Devuelve `404` si el producto no tiene un precio registrado.
---

### Eliminar Precio de Producto

`DELETE /api/prices/{product_id}`

Elimina el precio de un producto específico.

#### Respuesta
```json
{
    "message": "Price deleted successfully",
    "product_id": "123"
}
```

---

### Crear Política de Descuento

`POST /api/discounts`

Crea una nueva política de descuento.

#### Cuerpo de Solicitud
```json
{
    "name": "Black Friday Discount",
    "type": "percentage",
    "value": 20,
    "active": true,
    "start_date": "2024-11-01T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z",
    "product_ids": ["123", "456", "789"]
}
```

#### Respuesta
```json
{
    "message": "Discount created successfully",
    "discount_id": "456"
}
```

---
### Actualizar Política de Descuento

`PATCH /api/discounts/{discount_id}`

Crea una nueva política de descuento.

#### Cuerpo de Solicitud
```json
{
    "name": "Black Friday Discount",
    "type": "percentage",
    "value": 20,
    "active": true,
    "start_date": "2024-11-01T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z",
    "product_ids": ["123", "456", "789"]
}
```

#### Respuesta
```json
{
    "message": "Discount created successfully",
    "discount_id": "456"
}
```

---
### Aplicar Cupón

`POST /api/coupons/apply`

Aplica un cupón a un array de productos.

#### Cuerpo de Solicitud
```json
{
    "code": "BLACKFRIDAY",
    "product_ids": ["123", "456", "789"]
}
```

#### Respuesta
```json
{
    "message": "Coupon applied successfully",
    "applied_discount": 20,
    "final_prices": [
        {
            "product_id": "123",
            "final_price": 80.00
        },
        {
            "product_id": "456",
            "final_price": 64.00
        },
        {
            "product_id": "789",
            "final_price": 72.00
        }
    ]
}
```

---

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