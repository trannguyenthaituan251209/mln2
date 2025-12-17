import os
from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from markupsafe import Markup
import re

# ===== CONFIG =====
genai.configure(api_key=os.environ.get("AIzaSyD7tuQBxdHQEcgBeGDxDFlY4y2NAy3wm-g"))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ===== LOAD DOCUMENT =====
def load_documents(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        return []

DOCUMENTS = load_documents('resource.txt')

def search_documents(query):
    return [doc for doc in DOCUMENTS if query.lower() in doc.lower()]

def markdown_to_html(text):
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    text = re.sub(r'^\* (.+)$', r'<li>\1</li>', text, flags=re.MULTILINE)
    text = text.replace('\n', '<br>')
    if '<li>' in text:
        text = f"<ul>{text}</ul>"
    return Markup(text)

# ===== API =====
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_query = data.get('query', '')

    relevant_docs = search_documents(user_query)
    context = "\n".join(relevant_docs) if relevant_docs else "Không có tài liệu liên quan."

    policy_summary = (
        "Bạn là một Chatbot chuyên gia về Triết học Mác-Lênin, Tư tưởng Hồ Chí Minh. "
        "Luôn trả lời dễ hiểu, thân thiện. "
        "Không trả lời nội dung lập trình."
    )

    prompt = (
        f"{policy_summary}\n"
        f"Tài liệu tham khảo:\n\"\"\"\n{context}\n\"\"\"\n"
        f"Câu hỏi: {user_query}"
    )

    try:
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response = model.generate_content(prompt)
        answer = response.text if hasattr(response, 'text') else str(response)
        answer = markdown_to_html(answer)
    except Exception as e:
        answer = f"Lỗi: {str(e)}"

    return jsonify({"answer": str(answer)})

# ===== RUN =====
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
