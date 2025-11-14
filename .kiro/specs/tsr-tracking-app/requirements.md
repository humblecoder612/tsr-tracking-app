# Requirements Document

## Introduction

The TSR Tracking Application is an internal web application that replaces a manual email-based workflow for tracking Technical Service Requests (TSRs). The system enables team members to submit, view, and track TSR records through a centralized web interface, with full audit history of all changes and comments maintained in a timeline format.

## Glossary

- **TSR**: Technical Service Request - a formal request for technical service work
- **Post**: A TSR record stored in the system representing the current state of a TSR
- **Timeline Event**: A historical record of any action taken on a Post (creation, field modification, or comment)
- **Application**: The TSR Tracking web application system
- **User**: An authenticated team member who can create, view, and modify TSRs
- **Board**: The centralized table view displaying all TSR records
- **Identifier**: A user-facing ID for the TSR (e.g., circuit ID)

## Requirements

### Requirement 1: TSR Creation

**User Story:** As a team member, I want to submit a new TSR through a web form, so that I can replace the manual email process with a centralized system.

#### Acceptance Criteria

1. THE Application SHALL provide a form interface with fields for Identifier, TSR Number, Response Due date, End A, End Z, Data Rate Required, and optional Comments
2. WHEN a User submits a valid TSR form, THE Application SHALL create a Post record with all submitted field values
3. WHEN a User submits a valid TSR form, THE Application SHALL create a Timeline Event with event type POST_CREATED containing the Comments field value
4. IF any required field (Identifier, TSR Number, Response Due, End A, End Z, Data Rate Required) is missing, THEN THE Application SHALL display a validation error message and prevent submission
5. WHEN a Post is successfully created, THE Application SHALL redirect the User to either the Post detail page or the Board page with success feedback

### Requirement 2: TSR Board View

**User Story:** As a team member, I want to view all TSRs in a centralized table, so that I can see the status of all requests at a glance.

#### Acceptance Criteria

1. THE Application SHALL display a table containing all Post records with columns for Identifier, TSR Number, Response Due, End A, End Z, Data Rate Required, and Last Updated timestamp
2. WHEN a User clicks on a table row, THE Application SHALL navigate to the detailed view for that Post
3. THE Application SHALL provide a button to navigate to the TSR creation form
4. THE Application SHALL display the table in a mobile-responsive format that adapts to smaller screen sizes
5. THE Application SHALL sort Posts by a default ordering (Response Due or Last Updated)

### Requirement 3: TSR Detail and Timeline View

**User Story:** As a team member, I want to view a TSR's complete history, so that I can understand all changes and comments made over time.

#### Acceptance Criteria

1. THE Application SHALL display a summary card showing the current values of Identifier, TSR Number, Response Due, End A, End Z, Data Rate Required, Created At, and Last Updated
2. THE Application SHALL display all Timeline Events for the Post sorted by creation timestamp in descending order (newest first)
3. WHEN displaying a Timeline Event with event type POST_CREATED, THE Application SHALL show a creation label and the associated comment body
4. WHEN displaying a Timeline Event with event type FIELD_CHANGED, THE Application SHALL show the field name, old value, and new value
5. WHEN displaying a Timeline Event with event type COMMENT, THE Application SHALL show the comment body text

### Requirement 4: Comment Addition

**User Story:** As a team member, I want to add comments to a TSR, so that I can communicate updates and notes to other team members.

#### Acceptance Criteria

1. THE Application SHALL provide a text input interface on the Post detail page for adding comments
2. WHEN a User submits a comment, THE Application SHALL create a Timeline Event with event type COMMENT containing the comment text
3. WHEN a User submits a comment, THE Application SHALL update the Post's Last Updated timestamp
4. WHEN a comment is successfully added, THE Application SHALL display the new comment at the top of the timeline
5. IF a comment exceeds 2000 characters, THEN THE Application SHALL display a validation error and prevent submission

### Requirement 5: TSR Field Modification

**User Story:** As a team member, I want to edit TSR fields when information changes, so that the system reflects the current state of the request.

#### Acceptance Criteria

1. THE Application SHALL provide an interface to modify Post fields (Identifier, TSR Number, Response Due, End A, End Z, Data Rate Required)
2. WHEN a User modifies one or more fields, THE Application SHALL create a Timeline Event with event type FIELD_CHANGED for each modified field
3. WHEN creating a FIELD_CHANGED Timeline Event, THE Application SHALL record the field name, old value, and new value
4. WHEN field modifications are saved, THE Application SHALL update the Post record with the new values
5. WHEN field modifications are saved, THE Application SHALL update the Post's Last Updated timestamp

### Requirement 6: Data Persistence and History

**User Story:** As a team member, I want all TSR changes to be permanently recorded, so that I can audit the complete history of any request.

#### Acceptance Criteria

1. THE Application SHALL store all Timeline Events permanently without deletion during normal operations
2. THE Application SHALL maintain the current state of each Post in a separate record from Timeline Events
3. WHEN any Post field is modified, THE Application SHALL preserve the old value in a FIELD_CHANGED Timeline Event before updating the Post
4. THE Application SHALL store Timeline Events with sufficient detail to reconstruct the complete history of field values
5. THE Application SHALL associate each Timeline Event with a creation timestamp

### Requirement 7: Authentication and Authorization

**User Story:** As a system administrator, I want users to authenticate before accessing the application, so that only authorized team members can view and modify TSRs.

#### Acceptance Criteria

1. THE Application SHALL require User authentication via Supabase Auth before granting access to any TSR data
2. WHEN a Timeline Event is created, THE Application SHALL record the authenticated User's identifier as the creator
3. THE Application SHALL allow all authenticated Users to view all Post records
4. THE Application SHALL allow all authenticated Users to create new Posts
5. THE Application SHALL allow all authenticated Users to add comments and modify fields on any Post

### Requirement 8: Data Validation

**User Story:** As a system administrator, I want all TSR data to be validated, so that the system maintains data integrity.

#### Acceptance Criteria

1. THE Application SHALL validate that Identifier does not exceed 50 characters
2. THE Application SHALL validate that Response Due is a valid date value
3. THE Application SHALL validate that all required fields contain non-empty values before creating or updating a Post
4. THE Application SHALL validate comment text does not exceed 2000 characters
5. IF validation fails, THEN THE Application SHALL display a user-friendly error message indicating which field failed validation

### Requirement 9: Responsive Design

**User Story:** As a team member using mobile devices, I want the application to work on different screen sizes, so that I can access TSRs from any device.

#### Acceptance Criteria

1. THE Application SHALL render all pages in a mobile-first responsive layout
2. WHEN displayed on mobile devices, THE Application SHALL adapt the Board table to a simplified card or list format
3. THE Application SHALL ensure all form inputs are accessible and usable on touch devices
4. THE Application SHALL maintain readability of Timeline Events on small screen sizes
5. THE Application SHALL ensure all interactive elements (buttons, links) are appropriately sized for touch interaction
