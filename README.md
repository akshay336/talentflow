# TalentFlow — Enterprise Multi-Step Job Application Portal

A production-grade, enterprise-ready **6-Step Multi-Step Job Application Wizard** built with **Angular (Standalone Architecture)**, **TypeScript**, **RxJS**, and **Bootstrap 5.3**.

🔗 **Live Demo**: [https://akshay336.github.io/talentflow/](https://akshay336.github.io/talentflow/)

---

## 🌟 Executive Project Overview

TalentFlow is designed following enterprise Applicant Tracking System (ATS) UX patterns (similar to *Greenhouse*, *Workday*, and *Stripe*). It allows candidates to submit extensive job applications through an interactive, multi-step flow while maintaining state integrity, validating dynamic form controls, and handling client-side resume attachments without external backend dependencies.

### Key Highlights
- **Layered Architecture**: Full separation of concerns across `core/`, `shared/`, and `features/`.
- **Traditional Component Structure**: Every single component contains dedicated `.html` (template), `.css` (styles), `.ts` (logic), and `.spec.ts` (unit tests).
- **RxJS Reactive State Store**: Immutable, centralized application state using `BehaviorSubject` with single-source-of-truth semantics (no heavy `NgRx` overhead).
- **Typed Reactive Forms**: Strictly-typed Angular Reactive Forms (`FormGroup`, `FormArray`, `FormControl`) with custom enterprise validators.
- **Dynamic Form Handling**: Add, edit, and remove dynamic records with independent per-row validation for **Work Experience** and **Certifications**.
- **Client-Side Document Handling**: Drag-and-drop Resume Uploader with MIME format validation (`.pdf`, `.doc`, `.docx`), 5MB size limit checks, file preview, replace, and remove capabilities.
- **State Persistence**: Automatic background synchronization with `LocalStorage` to guarantee zero data loss across browser refreshes.
- **Responsive Layout**: Desktop tabular layout for education history with seamless transformation into touch-friendly cards on mobile devices.
- **Review & Pre-flight Validation**: Consolidated summary view with one-click section editing, live JSON payload preview, and duplicate submission prevention.

---

## 🏗️ Technical Architecture & The "What, Why, How"

### 1. Centralized State Store (`JobApplicationStoreService`)
* **What**: A singleton Angular service maintaining the master application state stream via an RxJS `BehaviorSubject<ApplicationState>`.
* **Why**:
  - Provides a single source of truth accessible by any step.
  - Eliminates tight coupling between step components (components never read or write directly to sibling components).
  - NgRx would add excessive boilerplate for a 6-step form wizard; RxJS gives lightweight, reactive, and predictable state streams.
* **How**:
  - Components subscribe to atomic selectors (e.g. `isCurrentStepValid$`, `progressPercentage$`).
  - Mutations are performed via explicit dispatch methods (e.g., `updatePersonalInfo()`, `updateEducation()`) that clone and emit immutable snapshots.

### 2. FormArray for Dynamic Rows
* **What**: Angular's `FormArray` enables dynamic addition and deletion of nested `FormGroup` items.
* **Why**: Candidates may have zero, one, or several previous employment positions and certifications.
* **How**:
  - Initialized with existing store records or empty default template.
  - Adding a position pushes a typed `FormGroup` with dedicated validators.
  - Deleting removes the control at that specific index and immediately syncs the updated array to the centralized store.

### 3. Client-Side Resume Upload & File Validation
* **What**: Reusable `FileUploadComponent` supporting drag-and-drop and native file picking.
* **Why**: Standard HTML file inputs cannot validate MIME signatures or provide rich preview/replace UX without custom handling.
* **How**:
  - Drag-over and drop event handlers inspect `File.size` (<= 5MB) and file extension (`.pdf`, `.doc`, `.docx`).
  - Reads metadata and generates Base64 data preview, broadcasting a `ResumeMetadata` object to the application store.

### 4. Enterprise Design System & Responsive UI
* **What**: Bootstrap 5.3 foundation augmented with modern CSS design tokens, crisp typography (*Inter* and *Plus Jakarta Sans*), and Bootstrap Icons.
* **Why**: Ensures an authentic corporate SaaS look without generic "AI-generated" or toy-project aesthetic.
* **How**:
  - Accessible contrast ratios, clear visual focus rings, custom stepper progress track, responsive data tables on desktop, and collapsible cards on mobile.

---

## 📁 Project Directory Structure

```
d:/CareerPortal/src/app/
│
├── core/
│   ├── models/
│   │   ├── job-application.model.ts       # ApplicationState, StepDefinition, Payload contracts
│   │   └── toast.model.ts                 # Toast notification interfaces
│   └── services/
│       ├── job-application-store.service.ts # Centralized RxJS Reactive Store
│       ├── job-application-store.service.spec.ts
│       ├── storage.service.ts             # Safe LocalStorage persistence engine
│       ├── storage.service.spec.ts
│       ├── toast.service.ts               # Event bus for reactive notifications
│       └── toast.service.spec.ts
│
├── shared/
│   ├── components/
│   │   ├── form-error/                    # Form field error message renderer
│   │   │   ├── form-error.component.html
│   │   │   ├── form-error.component.css
│   │   │   ├── form-error.component.ts
│   │   │   └── form-error.component.spec.ts
│   │   ├── stepper/                       # Visual stepper with progress bar
│   │   │   ├── stepper.component.html
│   │   │   ├── stepper.component.css
│   │   │   ├── stepper.component.ts
│   │   │   └── stepper.component.spec.ts
│   │   ├── file-upload/                   # Drag-and-drop resume upload
│   │   │   ├── file-upload.component.html
│   │   │   ├── file-upload.component.css
│   │   │   ├── file-upload.component.ts
│   │   │   └── file-upload.component.spec.ts
│   │   ├── toast-container/               # Toast notification viewport
│   │   │   ├── toast-container.component.html
│   │   │   ├── toast-container.component.css
│   │   │   ├── toast-container.component.ts
│   │   │   └── toast-container.component.spec.ts
│   │   └── modal/                         # Reusable modal dialog
│   │       ├── modal.component.html
│   │       ├── modal.component.css
│   │       ├── modal.component.ts
│   │       └── modal.component.spec.ts
│   └── validators/
│       └── custom-validators.ts           # Year range, score, phone & whitespace validators
│
└── features/
    └── job-application/
        ├── components/
        │   ├── personal-info/             # Step 1: Personal Info
        │   │   ├── personal-info.component.html
        │   │   ├── personal-info.component.css
        │   │   ├── personal-info.component.ts
        │   │   └── personal-info.component.spec.ts
        │   ├── education/                 # Step 2: Academic History (Grid/Cards)
        │   │   ├── education.component.html
        │   │   ├── education.component.css
        │   │   ├── education.component.ts
        │   │   └── education.component.spec.ts
        │   ├── work-experience/           # Step 3: Dynamic Work History (FormArray)
        │   │   ├── work-experience.component.html
        │   │   ├── work-experience.component.css
        │   │   ├── work-experience.component.ts
        │   │   └── work-experience.component.spec.ts
        │   ├── skills-qualifications/     # Step 4: Skills Chips & Certifications
        │   │   ├── skills-qualifications.component.html
        │   │   ├── skills-qualifications.component.css
        │   │   ├── skills-qualifications.component.ts
        │   │   └── skills-qualifications.component.spec.ts
        │   ├── additional-info/           # Step 5: Cover Letter & Resume Attachment
        │   │   ├── additional-info.component.html
        │   │   ├── additional-info.component.css
        │   │   ├── additional-info.component.ts
        │   │   └── additional-info.component.spec.ts
        │   └── review-submit/             # Step 6: Full Summary, Edit Links, Submission
        │       ├── review-submit.component.html
        │       ├── review-submit.component.css
        │       ├── review-submit.component.ts
        │       └── review-submit.component.spec.ts
        │
        ├── job-application-wizard.component.html
        ├── job-application-wizard.component.css
        ├── job-application-wizard.component.ts
        ├── job-application-wizard.component.spec.ts
        └── job-application.routes.ts
```

---

## ⚙️ Setup & Execution Instructions

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` or `v24.x` (Tested on `v24.13.0`)
- **npm**: `v9.x` or `v10.x` or `v11.x`
- **Angular CLI**: `v19+` / `v21.x`

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm start
# or
npx ng serve --port 4200
```
Navigate to `http://localhost:4200/` in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be output to `dist/career-portal/`.

### 4. Run Unit Tests
```bash
npm test
```

---

## 🛡️ Business Rules & Assumptions

1. **Personal Information (Step 1)**:
   - Full Name: Minimum 3 characters (trimmed).
   - Email: Standard RFC-compliant email pattern.
   - Phone Number: 10 to 15 digits numeric, allowing optional leading `+`.
   - Residential Address: Minimum 10 characters.

2. **Education Details (Step 2)**:
   - **SSC (10th)** and **HSC (12th)** are mandatory.
   - **Graduation** and **Post-Graduation** are optional and can be toggled on demand.
   - Passing Year must be a valid 4-digit year between `1970` and the current calendar year.
   - CGPA / Percentage must be numeric between `0` and `100`.

3. **Work Experience (Step 3)**:
   - Candidates can toggle "I am a Fresher" to bypass work history.
   - When not a fresher, at least 1 valid work record (Company Name, Job Title, Duration) is required.

4. **Skills & Certifications (Step 4)**:
   - At least 1 technical skill is mandatory.
   - Case-insensitive duplicate prevention prevents adding duplicate skills (e.g. "Angular" and "angular").
   - Certifications are optional dynamic entries.

5. **Additional Information & Resume (Step 5)**:
   - Cover letter must contain at least 50 characters with live character counter feedback.
   - Resume attachment is mandatory. Permitted file types: `.pdf`, `.doc`, `.docx`. Maximum file size: `5 MB`.

6. **Review & Submission (Step 6)**:
   - Pre-flight validation checks all 5 steps.
   - Submission emits full structured JSON payload to the browser developer console via `console.log`.
   - Displays confirmation modal with unique Application ID (e.g., `APP-2026-839201`) and submission timestamp.
   - Submission button is disabled during submission to prevent duplicate requests.

---

## 📦 Third-Party Libraries Used

| Library | Version | Purpose & Justification |
| :--- | :--- | :--- |
| **`bootstrap`** | `^5.3.x` | Responsive grid, form control baselines, utility classes, and layout scaffolding. |
| **`bootstrap-icons`** | `^1.11.x` | Standardized, crisp enterprise vector icons across buttons, stepper, badges, and dropzones. |
| **`rxjs`** | `~7.8.x` | Reactive streams, `BehaviorSubject` centralized store, debounce, and state transformations. |

---

## 🧪 Submission Verification

1. **Step-by-Step Navigation**: Clicking "Next Step" evaluates the current step, displaying aligned error messages and preventing progression if any mandatory fields are invalid, and smoothly advancing when valid.
2. **Data Retention**: Moving backward and forward preserves all previously entered data.
3. **Draft Recovery**: Refreshing or reopening the browser restores the state seamlessly via LocalStorage.
4. **Console Output**: Open Chrome DevTools (`F12` -> Console) on Step 6 submission to inspect the complete JSON payload.
