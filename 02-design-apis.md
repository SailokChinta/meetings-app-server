# API Design

Design the APIS, set up the routes and controller functions, and create Postman collection for the APIs.

- What question do we need to answer when designing an endpoint of an API
    - What HTTP method - GET / PUT / PATCH / POST / DELETE
    - What endpoint
        - api/meetings
    - What are the path parameters
        - GET api/meetings/:meetingid
            - Here meetingid is a path parameter
    - What query string params - used to customize / filter the output
        - ?date=2020-10-27&userId=123456789012345678901234
    - What data to send in the request body and in what format?
        - POST api/meetings
            - { name: '', description: '', ... }
    - What HTTP headers to be sent in the request?
        - Eg. Authorization header is sent for authentication
    - What data to send in the response body and in what format?
        - POST api/meetings
            - { _id: 1234, name: '', description: '', ... }
    - What are the error scenarios, what checks need to be made, and what are the HTTP status codes?
    - What are the HTTP headers to be sent in the response?
        - We will not explicitly set any in the app
    - What DB query / queries will fetch the desired data?

- Calendar page
    - /api/meetings?date=2020-10-27&userId=123456789012345678901234
    - __Note__: userId / emailid is temporary - We will remove it once we have authentication implemented
    - You can also send emailid instead

- Filter / Search meetings page
    - Search for meetings
        - GET
        - /api/meetings
        - ?date=UPCOMING&searchTerms=app%20ui%20design&userId=123456789012345678901234
        - [ {}, {} ] where every object is a meeting object (response could be an empty array too)
        - Error scenarios
            - userId does not exists - 404 response
            - date format not supported - 400 response (bad request)
        - Mongo DB query
            - filter clause
                - date filter?
                    - $lt, $gt, $eq
                - description filter?
                    - $regex match
                        - OPTIONAL: Instead of $regex match you can find how to set up text index on fields in a document of a collection, and perform text search
    
    - Excuse yourself
        - PATCH
        - /api/meetings/:meetingid or /api/meetings/:meetingid/:action where :action = deleteUser
        - ?userId=123456789012345678901234 or ?userId=123456789012345678901234&action=deleteUse
        Alternatively, design the API this way...
        - DELETE /api/meetings/:meetingid/users/:userId
    - Get list of users
        - GET
        - /api/users
        - Returns an array of users
    - Add users
        - PATCH
        - /api/meetings/:meetingid or /api/meetings/:meetingid/:action where :action = addUser
        - req body
        - Error scenarios
            - userId and email are necessary or else give 400
        Alternatively
        - POST /api/meetings/:meetingid/users
    - Add Meeting
        - POST
        - /api/meetings/add
        - request body: array of meetings
        - request header: auth header
        - respnse body: array of inserted meetings
        - error scenario
            - 400 - bad request
            - else 201 - created
        
- Teams
    - Add a Team
        - POST
        - /api/teams/add
        -  array of teams details
        - Auth token
        - added teams in json
        - 201 or 400 or 500
    - Add a team member
        - PATCH
        - 