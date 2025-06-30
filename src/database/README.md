# Configuración de Base de Datos con Drizzle ORM

## Estructura de Schemas

### Tablas Configuradas

1. **users** - Información de usuarios
   - `id` (serial, primary key)
   - `name` (varchar)
   - `email` (varchar, unique)
   - `password` (varchar)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

2. **accounts** - Cuentas bancarias/efectivo
   - `id` (serial, primary key)
   - `name` (varchar)
   - `currency` (varchar)
   - `initialBalance` (decimal)
   - `totalBalance` (decimal)
   - `description` (text)
   - `userId` (integer, foreign key)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

3. **categories** - Categorías para transacciones
   - `id` (serial, primary key)
   - `name` (varchar)
   - `color` (varchar, formato hex)
   - `type` (char, '1'=ingreso, '2'=gasto)

4. **transactions** - Transacciones de dinero
   - `id` (serial, primary key)
   - `name` (varchar)
   - `type` (char, '1'=ingreso, '2'=gasto)
   - `amount` (decimal)
   - `description` (text)
   - `date` (date)
   - `userId` (integer, foreign key)
   - `accountId` (integer, foreign key)
   - `categoryId` (integer, foreign key)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

## Comandos de Drizzle

### Generar migraciones
```bash
npm run db:generate
```

### Aplicar migraciones
```bash
npm run db:migrate
```

### Abrir Drizzle Studio (interfaz visual)
```bash
npm run db:studio
```

### Push directo a la base de datos (desarrollo)
```bash
npm run db:push
```

## Uso de las Operaciones

### Ejemplo de uso de operaciones de usuario:

```typescript
import { createUser, getUserById, updateUser, deleteUser } from './database/operations/userOperations.js';

// Crear un usuario
const newUser = await createUser({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'hashedPassword'
});

// Obtener un usuario
const user = await getUserById(1);

// Actualizar un usuario
const updatedUser = await updateUser(1, { name: 'Juan Carlos Pérez' });

// Eliminar un usuario
const deleted = await deleteUser(1);
```

### Ejemplo de uso de operaciones de transacciones:

```typescript
import { createTransaction, getTransactionsByUserId } from './database/operations/transactionOperations.js';

// Crear una transacción
const newTransaction = await createTransaction({
  name: 'Compra de comida',
  type: '2', // gasto
  amount: 25.50,
  description: 'Compra en el supermercado',
  date: new Date(),
  userId: 1,
  accountId: 1,
  categoryId: 1
});

// Obtener transacciones de un usuario con información relacionada
const transactions = await getTransactionsByUserId(1);
```

## Variables de Entorno

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=money_move
DB_USER=postgres
DB_PASSWORD=tu_password
```

## Tipos TypeScript

Cada schema exporta automáticamente los tipos TypeScript:
- `User` / `NewUser` para usuarios
- `Account` / `NewAccount` para cuentas
- `Category` / `NewCategory` para categorías
- `Transaction` / `NewTransaction` para transacciones 