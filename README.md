
# Deception Detectors
    
## YOLO Module:
- **Purpose**: Used for detecting reviews, carts, and determining items that are being added or removed by the user.
- **Model**: We use a YOLOv8n model for robust detection.
- **Text Extraction**: PaddleOCR is used to extract text from images.
- **Model Choice**: The nano version of YOLO is used due to its lightweight nature.
- **Deployment**: To ensure scalability, the model is deployed using TF-Lite on the client side, allowing for real-time processing and reduced server load.

## Text Module:
The text module uses a **3-layer architecture**:

1. **First Layer (Text Classification)**:
    - **Model**: A distil-RoBERTa model is trained to classify text as either dark or not-dark.
    - **Purpose**: To filter out possible false positive alarms in our classification layer.

2. **Second Layer (Similarity Search)**:
    - **Model**: A RAG-based system queries our database to determine the similarity between the target text and existing samples in our database.
    - **Samples**: The database contains samples from categories like subscription trickery, false urgency, confirm shaming, misdirection, and scarcity.
    - **Storage**: Embeddings of text data and their corresponding labels (from Mathur et al., augmented using LLMs for different classes) are stored in a vector database (Weaviate) for faster processing and real-time response.
    - **Reason for RAG**: Since common dark patterns have similarities across websites, RAG can accommodate these changing patterns effectively.

3. **Third Layer (LLM for Classification)**:
    - If similarity between the text and samples in our database is low, we query an LLM (Mistral) to classify the text as a dark pattern.
    - **Efficiency**: LLMs are used as a last resort due to their computational expense and scalability concerns.
    - **Thresholding Technique**: To reduce false negatives, we set a strict threshold for RAG similarity. Only if the similarity crosses a certain value, the text is flagged.

## Client Interface:
- **Flow**: When a client visits a page and chooses to analyze it with our extension:
    - The **text** is sent to the Text Module.
    - The **images** are sent to the YOLO Module.
- **Real-time Processing**: We use FastAPI's WebSockets for real-time flagging and reporting.
- **Reporting**: A real-time updated pie chart visualizes the found dark patterns.

## Review Analysis Module:
1. **Complaint Detection**: Reviews are queried into the LLM (Mistral) to detect if the review is a complaint about bait and switch tactics.
2. **Fake Review Classification**: Queries are made to the fake review classification model to check the authenticity of reviews.

## Event Tracking and User Interaction:
- **DOM Mutation Listener**: We listen for user-visible DOM mutations and the event dispatch cycle to track user interactions.
- **Forced Action Flagging**: Content obstructing user interaction that isn’t user-initiated is flagged as nagging or forced action.
- **Cart Tracking**: We detect user actions related to adding/removing items from the cart and query the YOLO module to track the cart's contents. This data is checked against checkout items to detect possible basket sneaking.
- **Checkbox Preselction Detection**: We query for possible pre-selection of checkboxes by the webpage and flag or remove them.

## User Review System:
- **Reporting**: Users can report found dark patterns on websites with different labels, which are stored in the vector database. This helps maintain a robust, evolving model.
- **UI Element Selection**: Users can select a specific UI element and report it under a given label.

