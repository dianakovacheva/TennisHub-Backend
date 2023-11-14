# TennisHub Backend API endpoints

## auth endpoints

```
- /auth/register
- /auth/login
- /auth/logout
```

## users endpoints

```
- /user/<user-id>
- /user/<user-id>/clubs
- /user/<user-id>/bookings
```

## clubs endpoints

```
- /clubs/
- /club/<club-id>/
- /club/<club-id>/join/
- /club/<club-id>/leave/

- /club/<club-id>/courts/
- /club/<club-id>/courts/<court-id>/

- /club/<club-id>/members/
```

## booking enpoints

```
/bookings?court_id=<court-id>&date=<date>
/booking/<booking-id>
```

## comments endpoints

```
/comments?club-id%user-id
```
