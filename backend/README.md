# How to run?
1. `npm install`
2. `npm run build`
3. `npm start`

The backend will run at port 1337


# API Docs:

## Cá nhân:
### Đăng nhập:
- Method: POST
- URL: http://localhost:1337/api/auth/local
- Body (RAW JSON):
```
{
    "identifier": "engineer",
    "password": "12345678"
}
```

### Thông tin cá nhân:
- Method: GET
- URL: http://localhost:1337/api/users/me?populate=*

## 