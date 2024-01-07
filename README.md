# REST-api for my React project - TennisHub

## Server-side

The server-side API endpoints will be available at http://localhost:3000/api

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
- /user/<user-id>/edit
- /user/<user-id>/clubs
- /user/<user-id>/bookings
```

## clubs endpoints

```
- /club/create
- /club/<club-id>
- /club/<club-id>/edit
- /club/<club-id>/delete
- /club/<club-id>/join
- /club/<club-id>/leave
- /club/<club-id>/members
- /club/
```

## courts endpoints

```
- /club/court/create
- /club/court/<court-id>/edit
- /club/court/<court-id>/delete
- /club/<club-id>/court/<court-id>
- /club/<club-id>/courts
```

## booking enpoints

```
- /booking/book-court
- /booking/<booking-id>
- /booking/<booking-id>/edit
- /booking/<booking-id>/delete
- /bookings?court_id=<court-id>&date=<date>
- /booking/
```

## comments endpoints

```
- /comments/club/<club-id>
- /comments/club/<club-id>/add-comment
- /comments/<comment-id>/edit
- /comments/<comment-id>/delete
- /comments/user/<user-id>
- /comments/
```

## search endpoint

```
- /club/search
```
