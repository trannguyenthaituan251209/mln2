from multiprocessing import context
from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS  # Thêm dòng này
from markupsafe import Markup
import re

genai.configure(api_key="AIzaSyD7tuQBxdHQEcgBeGDxDFlY4y2NAy3wm-g")
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Cho phép mọi thiết bị truy cập

def load_documents(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        # Mỗi dòng là một tài liệu, hoặc bạn có thể xử lý theo đoạn, theo file...
        return [line.strip() for line in f if line.strip()]

DOCUMENTS = load_documents('resource.txt')  # Đặt file resource.txt cùng thư mục với code

def search_documents(query):
    return [doc for doc in DOCUMENTS if query.lower() in doc.lower()]

def markdown_to_html(text):
    # Xử lý **bold**
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    # Xử lý *italic*
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    # Xử lý danh sách bắt đầu bằng *
    text = re.sub(r'^\* (.+)$', r'<li>\1</li>', text, flags=re.MULTILINE)
    # Xử lý xuống dòng thành <br>
    text = text.replace('\n', '<br>')
    # Đưa các <li> vào <ul> nếu có
    if '<li>' in text:
        text = re.sub(r'(<li>.*?</li>)', r'<ul>\1</ul>', text, flags=re.DOTALL)
    # Loại bỏ ký tự lạ (chỉ giữ lại ký tự unicode cơ bản và một số ký tự đặc biệt)
    text = re.sub(r'[^\w\s.,;:!?@<>\-/\\\(\)\[\]{}="\'|&%$#áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđĐ]', '', text)
    return Markup(text)

@app.route('/ask', methods=['POST'])
def ask():
    user_query = request.json.get('query')
    relevant_docs = search_documents(user_query)
    policy_summary = (
    "Bạn là một Chatbot chuyên gia về Triết học Mác-Lênin, Tư tưởng Hồ Chí Minh và các lĩnh vực liên quan. "
    "- Luôn trả lời dễ hiểu, thân thiện. Tuyệt đối không trả lời bạn chuyên về lĩnh vực gì"
    "- Nếu câu hỏi không nằm trong tài liệu, bạn sẽ trả lời phần này không thuộc tài liệu và tìm kiếm trên Internet để trả lời. Hãy nhớ rằng đính kèm nguồn cho người dùng" 
    "- Nếu có nguồn trong tài liệu này, không cần trích nguồn Internet"
    "- Không trả lời có chứa đường dẫn, module, code hay bất kỳ điều gì liên quan đến lập trình"
    )
    # Ghép prompt đầy đủ
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)