
---

# ClassOptima Timetable Scheduler

Welcome to the ClassOptima Timetable Scheduler project! This project aims to provide a robust solution for managing class schedules efficiently.

**UI/UX Design:** [Figma Prototype](https://www.figma.com/file/K4Xk5k7pIX8aeQqmvYSTeB/Untitled?type=design&node-id=0%3A1&mode=design&t=ONkkH4hsu1aG3UIk-1)

**Documentation:** [Project Documentation](https://docs.google.com/document/d/11n_TYFEynqpTnvAOKrJC-x9fNOyhIy7l/edit?usp=drive_link&ouid=105202207662230114941&rtpof=true&sd=true)

## Installation

To get started, clone this repository:

```bash
git clone https://github.com/bakare-dev/ClassOptima.git
```

## Backend Development

Switch to the backend development branch:

```bash
git checkout backend-dev
```

Refer to the README in the backend-dev branch for instructions on setting up and running the backend code.

## Algorithm for Generating Class Timetable

The `generateClassTimetable` algorithm follows these steps:

1. **Initialization**:
   - Prepare an empty timetable object with slots for Monday to Friday.

2. **Processing Events**:
   - Iterate over each event.
   - For each event:
     - Retrieve the venue and recurring status.
     - Retrieve associated levels and departments for the event.
     - If the event is recurring:
       - Check if it's scheduled for a specific day or every day of the week.
       - If scheduled, add the event details to the respective day's timetable.
     - If it's not recurring, add the event details to its specified day's timetable.

3. **Assign Courses**:
   - Iterate over each course.
   - Check if the course's level or department matches with any event's level or department.
   - If matched, find available slots in the timetable for the course and assign it to the timetable.

4. **Cleanup and Storage**:
   - Remove unnecessary properties from the timetable.
   - Write the timetable to a JSON file.

## Algorithm for Generating Exam Timetable

The `generateExamTimetable` algorithm follows these steps:

1. **Initialization**:
   - Prepare an empty timetable object.

2. **Processing Dates**:
   - Iterate over each date between the start and end dates.
   - Check if the date falls on a weekday.
   - If yes, prepare the timetable entry for that date.

3. **Assign Exams**:
   - Iterate over each course.
   - Check if the course's exam is not already scheduled.
   - Find available slots for the exam on the respective date and assign it to the timetable.

4. **Storage**:
   - Write the timetable to a JSON file.

## Data Flow Diagrams (DFDs)

### Level 0 DFD:

```
               +-------------------+
               |   Timetable      |
               |   Generator      |
               +--------+----------+
                        |
                        V
       +-----------------------------------+
       |       Generate Timetable         |
       +-----------------------------------+
                        |
                        V
       +-----------------------------------+
       |       Process Courses & Events    |
       +-----------------------------------+
                        |
                        V
       +-----------------------------------+
       |       Generate Class Timetable    |
       |       Generate Exam Timetable     |
       |       Generate Excel Timetable    |
       +-----------------------------------+
                        |
                        V
       +-----------------------------------+
       |       Store Timetable             |
       +-----------------------------------+
```

### Level 1 DFD (Expanded "Generate Timetable" Process):

```
               +-------------------+
               |   Timetable      |
               |   Generator      |
               +--------+----------+
                        |
                        V
       +-----------------------------------+
       |       Generate Timetable         |
       +-----------------------------------+
                        |
                        V
       +-----------------------------------+
       |       Input: Courses, Events     |
       |       Output: Timetable          |
       +-----------------------------------+
```

This DFD provides a high-level overview of the data flow and processes involved in the timetable generation system. Each process can be further expanded to include detailed subprocesses and data transformations.

## Acknowledgements

Special thanks to [Dev Hills](https://github.com/dev-hills) for his valuable contributions to the frontend development, and our anonymous UI/UX designer for his exceptional design work.

Your contributions have greatly enhanced the functionality and usability of the ClassOptima Timetable Scheduler project. We appreciate your dedication and expertise!

## Contributions

Contributions are welcome! Please refer to the contribution guidelines in the respective branches for more information.

## Issues

If you encounter any issues or have suggestions, please feel free to open an issue in the respective branches' issue tracker.

Happy scheduling!

---
