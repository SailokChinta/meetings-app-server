# Model
- User
    - name: String, required
    - email: String, required, unique
    - password: String, required, hashed password
_Note_: Attendees will include all the email ids of team members who are part of team, when the team was added to team
- Meetings
    - name: String ( optional key )
    - description: String, required, minLength
    - date: Date, required
    - startTime: { hh: Number, 0 - 23 required, mm: Number, 0 - 59 required }
    - endTime: { hh: Number, 0 - 23 required, mm: Number, 0 - 59 required }
    - attendees: [
        { attendeeId: ObjectId, email: attendeeEmailId },
        { attendeeId: ObjectId, email: attendeeEmailId },
        { attendeeId: ObjectId, email: attendeeEmailId },
    ]
- Teams
    - name: String