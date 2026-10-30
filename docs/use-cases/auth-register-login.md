# Register and login

## Business goal
Allow a customer to create an account and let customer, seller, and admin authenticate.

## Actors
- Customer
- Seller (seeded)
- Admin (seeded)

## Main flow
1. Customer submits full name, email, phone, password.
2. System rejects duplicate email or phone.
3. System stores a CUSTOMER account and customer profile.
4. Customer logs in with email and password.
5. System sets httpOnly JWT cookies and returns role.

## Related endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/session`

## Current implementation notes
Register also sets JWT cookies so the customer is signed in immediately.
Email verification and password reset are not implemented yet.
