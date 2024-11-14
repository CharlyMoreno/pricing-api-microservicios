# Pricing-Api

## Descripción

El microservicio de **Pricing** gestiona los precios de un catálogo, genera políticas de descuentos, maneja precios especiales, cupones y descuentos, y permite consultar precios para el proceso de compras. También notifica cambios de precios de forma asíncrona a otros servicios, como **Stats**.

## Casos de Uso

### 1. Mantener Precios del Catálogo
- **Actor:** Administrador del sistema.
- **Descripción:** Permitir al administrador agregar, actualizar y eliminar precios de productos en el catálogo.

### 2. Generar Políticas de Descuentos
- **Actor:** Administrador del sistema.
- **Descripción:** Permitir la creación, actualización y eliminación de políticas de descuentos que se aplican a productos o categorías específicas.

### 3. Manejar Cupones
- **Actor:** Cliente.
- **Descripción:** Permitir a los clientes aplicar cupones y obtener precios con descuento durante la compra.

### 4. Notificar Nuevos Precios
- **Actor:** Sistema de estadísticas.
- **Descripción:** Notificar de forma asíncrona a otros sistemas sobre cambios en los precios para su análisis y uso en reportes.

## Modelo de Datos

1. **Price**
   - `id`: string - Identificador único del precio
   - `product_id`: string - ID del producto asociado
   - `price`: number - Precio actual del producto
   - `category`: string - Categoría del producto

2. **Discount**
   - `id`: string - Identificador único del descuento
   - `name`: string - Nombre del descuento
   - `type`: string - Tipo de descuento (porcentaje, fijo, etc.)
   - `value`: number - Valor del descuento
   - `active`: boolean - Indica si el descuento está activo
   - `start_date`: date - Fecha de inicio del descuento
   - `end_date`: date - Fecha de finalización del descuento
   - `product_ids`: array of strings - IDs de los productos asociados

3. **Coupon**
   - `id`: string - Identificador único del cupón
   - `code`: string - Código del cupón
   - `discount_type`: string - Tipo de descuento que aplica el cupón (porcentaje, monto fijo, etc.)
   - `discount_value`: number - Valor del descuento (si aplica un descuento porcentual o fijo)
   - `applicable_products`: array of strings - IDs de productos específicos a los que aplica el cupón
   - `minimum_purchase`: number - Monto mínimo de compra necesario para activar el cupón (opcional)
   - `uses_limit`: number - Límite de usos del cupón
   - `active`: boolean - Indica si el cupón está activo
   - `start_date`: date - Fecha de inicio del cupón
   - `end_date`: date - Fecha de finalización del cupón

### Explicación de Cupones
- **Cupón por Compra Mínima:** Configurar minimum_purchase para aplicar el cupón solo en compras superiores a cierto monto.
- **Aplicación en Productos :** Usar applicable_products para limitar el cupón a ciertos productos.
- **Límite de Usos:** Con uses_limit, el cupón solo se podrá utilizar un número determinado de veces (útil para promociones limitadas).
- **Descuento Variable:** Personalizar discount_type y discount_value permite aplicar descuentos específicos sin depender de un descuento fijo.

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
    "discounts": []
}
```

#### Errores
- Devuelve `404` si el producto no tiene un precio registrado.

---

### Crear Precio de Producto

`POST /api/prices`

Crea el precio de un producto.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

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

`PUT /api/prices/{product_id}`

Actualiza el precio de un producto específico.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

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

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

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

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

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

`PUT /api/discounts/{discount_id}`

Actualiza una nueva política de descuento.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

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
### Crear Cupón

`POST /api/coupons`

Este endpoint permite crear un nuevo cupón con las propiedades especificadas en el modelo de datos.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

#### Cuerpo de Solicitud
```json
{
    "code": "BLACKFRIDAY2024",
    "discount_type": "percentage",
    "discount_value": 25,
    "applicable_products": ["123", "456"],
    "applicable_categories": ["electronics", "appliances"],
    "minimum_purchase": 100,
    "uses_limit": 10,
    "active": true,
    "start_date": "2024-11-20T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z"
}
```

#### Respuesta
```json
{
    "message": "Coupon created successfully",
    "coupon_id": "789"
}
```

#### Explicación de Campos
- `code`: Código único del cupón.
- `discount_type`: Tipo de descuento (`percentage` o `fixed`).
- `discount_value`: Valor del descuento (por ejemplo, 25% o $10).
- `applicable_products`: Lista de IDs de productos a los que aplica el cupón (opcional).
- `applicable_categories`: Lista de categorías a las que aplica el cupón (opcional).
- `minimum_purchase`: Monto mínimo necesario para que el cupón sea válido (opcional).
- `uses_limit`: Número máximo de usos permitidos para el cupón.
- `active`: Estado del cupón (activo/inactivo).
- `start_date` y `end_date`: Fechas de inicio y finalización de validez del cupón.

---

### Modificar Cupón

`PUT /api/coupons/{coupon_id}`

Este endpoint permite modificar las propiedades de un cupón existente.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

#### Cuerpo de Solicitud
```json
{
    "code": "BLACKFRIDAY2024",
    "discount_type": "percentage",
    "discount_value": 30,
    "applicable_products": ["123", "456", "789"],
    "applicable_categories": ["electronics"],
    "minimum_purchase": 120,
    "uses_limit": 5,
    "active": true,
    "start_date": "2024-11-20T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z"
}
```

#### Respuesta
```json
{
    "message": "Coupon updated successfully",
    "coupon_id": "789"
}
```

#### Errores
- Devuelve `404` si el `coupon_id` no existe.

### Aplicar Cupón

`POST /api/coupons/apply`

Aplica un cupón a un array de productos.

#### Headers
| Cabecera               | Contenido           |
|------------------------|---------------------|
| `Authorization: Bearer xxx` | Token en formato JWT |

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