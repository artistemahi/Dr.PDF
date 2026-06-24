# 🩺 Dr.PDF API Documentation

This document contains all API endpoints for the Dr.PDF platform.

---

## 🔐 Auth APIs

### authRouter
- POST   /auth/signup
- POST   /auth/login
- POST   /auth/logout
---

## 👤 Profile APIs

### profileRouter
- GET    /profile/view
- PATCH  /profile/edit
- PATCH  /profile/password
- DELETE /profile/delete

---

## 📄 File APIs

### fileRouter
- POST   /file/upload
- GET    /file/:fileId
- DELETE /file/:fileId
- GET    /file/user/all

---

## 🛠️ Core PDF APIs

### pdfRouter

#### File Operations
- POST /pdf/merge
- POST /pdf/split
- POST /pdf/extract-pages
- POST /pdf/delete-pages
- POST /pdf/reorder-pages

---

#### Compression & Optimization
- POST /pdf/compress
  - level
  - targetsize
  - smartai 
- POST /pdf/optimize  (scaling and improving quality)

#### Security
- POST /pdf/protect
- POST /pdf/unlock
- POST /pdf/add-watermark
- POST /pdf/remove-watermark

---
#### Editing (optional)
- POST /pdf/edit
- POST /pdf/add-text
- POST /pdf/add-image
- POST /pdf/annotate
- POST /pdf/highlight

#### Organization
- POST /pdf/rotate
- POST /pdf/crop
- POST /pdf/page-numbers
- POST /pdf/header-footer

---
#### Conversion
- POST /pdf/convert
## 🔄 Conversion APIs (Optional)

### conversionRouter
- POST /convert/pdf-to-word
- POST /convert/pdf-to-excel
- POST /convert/pdf-to-ppt
- POST /convert/pdf-to-image

- POST /convert/word-to-pdf
- POST /convert/image-to-pdf
---

## 🧠 AI APIs (Core USP)

### aiRouter

#### Summarization
- POST /ai/summarize/:type  
  - type = full | short | bullets

---

#### Notes
- POST /ai/notes

---

#### Translation
- POST /ai/translate  
  - body: { targetLanguage }

---

#### Chat with PDF
- POST /ai/chat/:fileId

---

#### Highlights
- POST /ai/highlights

---

#### Specialized AI
- POST /ai/analyze/resume
- POST /ai/analyze/research
- POST /ai/analyze/invoice

---

## 📊 Extraction APIs

### extractionRouter
- POST /extract/text
- POST /extract/tables
- POST /extract/images
- POST /extract/metadata

---

## 🔍 OCR APIs

### ocrRouter
- POST /ocr/scan
- POST /ocr/image-to-text

---

## ✍️ Signature APIs

### signatureRouter
- POST /sign/add
- POST /sign/save
- POST /sign/request

---

## 📂 User APIs

### userRouter
- GET /user/files
- GET /user/history
- GET /user/ai-history
- GET /user/storage

---

## 🔄 Workflow APIs (Future Scope)

### workflowRouter
- POST /workflow/create
- GET  /workflow/all
- POST /workflow/run/:workflowId
- DELETE /workflow/:workflowId

---

## 🧠 Enums / Types

### Summary Types
- full
- short
- bullets

---

### File Status
- uploaded
- processing
- completed
- failed

---

### AI Types
- summarize
- notes
- translate
- chat

---

## 🚀 Example Flow

### Upload + Summarize

1. Upload file  
   POST /file/upload  

2. Get summary  
   POST /ai/summarize/full  
   body: { fileId }

---

## 📌 Notes

- All APIs return JSON responses
- Authentication required for protected routes
- File upload uses multipart/form-data

---

## 📍 Status

🚧 Under Development (MVP Phase)