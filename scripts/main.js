// main.js - ✅ BẮT ĐẦU TỪ ĐÂY

const el = document.getElementById("typing-title");
const text = el.dataset.text;
let index = 0;

el.classList.add("typing");
el.textContent = "";

function type() {
    if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
        setTimeout(type, 20);
    } else {
        el.classList.remove("typing");
    }
}

type();

document.addEventListener('DOMContentLoaded', function() {
    const imgs = document.querySelectorAll('.zoomable');
    const lightbox = document.getElementById('img-lightbox');
    const lightboxImg = document.getElementById('img-lightbox-img');

    imgs.forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', function() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    });
});
// Chatbox toggle logic
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('chatbox-toggle');
    const popup = document.getElementById('chatbox-popup');
    const closeBtn = document.getElementById('chatbox-close');
    const form = document.getElementById('chatbox-form');
    const input = document.getElementById('chatbox-input');
    const messages = document.getElementById('chatbox-messages');

    toggle.onclick = () => {
        popup.style.display = 'flex';
        toggle.style.display = 'none';
    };
    closeBtn.onclick = () => {
        popup.style.display = 'none';
        toggle.style.display = 'block';
    };

form.onsubmit = async (e) => {
    e.preventDefault();

    const userMsg = input.value.trim();
    if (!userMsg) return;

    // User bubble
    appendMessage(userMsg, false);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // ✅ Tạo AI bubble có loading bên trong
    const aiBubble = appendMessage('', true, false, true);

    try {
        const res = await fetch('https://backend-mln2.onrender.com/ask', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: userMsg })
        });

        const data = await res.json();

        // ✅ Tắt loading trong bubble này + gõ chữ vào chính bubble này
        typeWriterEffectToBubble(aiBubble, data.answer);

    } catch (err) {
        // ✅ Tắt loading + báo lỗi ngay trong bubble
        aiBubble.innerHTML = '<span style="color:red;">Lỗi kết nối server!</span>';
        console.error(err);
    }
};
});

function appendMessage(content, isAI = false, isTyping = false, isLoading = false) {
    const row = document.createElement('div');
    row.className = 'chatbox-message-row ' + (isAI ? 'chatbox-message-ai' : 'chatbox-message-user');

    const bubble = document.createElement('div');
    bubble.className = 'chatbox-bubble ' + (isAI ? 'chatbox-bubble-ai' : 'chatbox-bubble-user');

    if (isLoading) {
        bubble.innerHTML = `
            <div class="chatbox-loading" style="height:24px;margin-bottom:0;">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
        `;
    } else {
        bubble.innerHTML = content;
    }

    row.appendChild(bubble);
    document.getElementById('chatbox-messages').appendChild(row);
    document.getElementById('chatbox-messages').scrollTop = document.getElementById('chatbox-messages').scrollHeight;

    return bubble; // ✅ thêm dòng này
}



function showLoading() {
    let loading = document.getElementById('chatbox-loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'chatbox-loading';
        loading.className = 'chatbox-loading';
        loading.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        document.getElementById('chatbox-messages').appendChild(loading);
    }
    loading.style.display = 'flex';
    document.getElementById('chatbox-messages').scrollTop = document.getElementById('chatbox-messages').scrollHeight;
}
function hideLoading() {
    const loading = document.getElementById('chatbox-loading');
    if (loading) loading.style.display = 'none';
}

// Hiệu ứng gõ chữ
function typeWriterEffectToBubble(bubble, text, callback) {
    // ✅ xóa loading nếu còn
    const loading = bubble.querySelector('.chatbox-loading');
    if (loading) loading.remove();

    let i = 0;
    function typing() {
        if (i <= text.length) {
            bubble.innerHTML = text.slice(0, i) + '<span style="opacity:0.5;">|</span>';
            i++;
            setTimeout(typing, 18);
        } else {
            bubble.innerHTML = text;
            if (callback) callback();
        }
    }
    typing();
}

const quizFile = document.getElementById('quiz-file');
if (quizFile) {
  quizFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const questions = JSON.parse(evt.target.result);
        renderQuiz(questions);
      } catch (err) {
        alert('File không đúng định dạng JSON!');
      }
    };
    reader.readAsText(file, 'UTF-8');
  });
}


function renderQuiz(questions) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    questions.forEach((q, idx) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.innerHTML = `
            <div class="quiz-q">${idx + 1}. ${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <label>
                        <input type="radio" name="q${idx}" value="${i}">
                        ${opt}
                    </label>
                `).join('<br>')}
            </div>
        `;
        container.appendChild(qDiv);
    });
}

const questions = [

  {
    "question": "Cuộc cách mạng công nghiệp lần thứ nhất khởi phát từ nước nào và gắn liền với thành tựu kỹ thuật nào?",
    "options": [
      "Nước Anh - Máy hơi nước",
      "Nước Mỹ - Công nghệ thông tin",
      "Nước Pháp - Động cơ đốt trong",
      "Nước Đức - Điện năng"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "question": "Trong bối cảnh hiện nay, yếu tố nào được coi là 'lực lượng sản xuất trực tiếp' quan trọng nhất thúc đẩy quá trình công nghiệp hóa, hiện đại hóa?",
    "options": [
      "Vốn đầu tư nước ngoài (FDI)",
      "Tài nguyên thiên nhiên phong phú",
      "Khoa học và công nghệ",
      "Số lượng lao động phổ thông lớn"
    ],
    "answer": 2,
    "explanation": "Trong kỷ nguyên hiện đại, tri thức khoa học và công nghệ trở thành động lực chính, trực tiếp tạo ra của cải và nâng cao năng suất lao động."
  },
  {
    "question": "Tại sao CNH, HĐH được coi là nhiệm vụ trung tâm trong suốt thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam?",
    "options": [
      "Vì Việt Nam cần gia nhập WTO nhanh chóng",
      "Vì Việt Nam có xuất phát điểm là nền kinh tế nông nghiệp lạc hậu",
      "Vì thế giới đang diễn ra cách mạng công nghiệp 4.0",
      "Vì cần giải quyết vấn đề việc làm cho nông dân"
    ],
    "answer": 1,
    "explanation": "Để xây dựng chủ nghĩa xã hội, cần có cơ sở vật chất kỹ thuật hiện đại. Với xuất phát điểm thấp từ nông nghiệp, Việt Nam bắt buộc phải tiến hành công nghiệp hóa để chuyển đổi nền sản xuất."
  },
  {
    "question": "Nội dung nào sau đây KHÔNG phải là đặc trưng của Cách mạng công nghiệp lần thứ tư (4.0)?",
    "options": [
      "Trí tuệ nhân tạo (AI)",
      "Internet vạn vật (IoT)",
      "Dữ liệu lớn (Big Data)",
      "Dây chuyền lắp ráp tự động hóa dựa trên máy tính (Cơ khí hóa)"
    ],
    "answer": 3,
    "explanation": ""
  },
  {
    "question": "Một trong những nội dung cơ bản của CNH, HĐH ở Việt Nam là chuyển dịch cơ cấu kinh tế theo hướng nào?",
    "options": [
      "Tăng tỷ trọng nông nghiệp, giảm tỷ trọng dịch vụ",
      "Giữ nguyên tỷ trọng các ngành để ổn định",
      "Tăng tỷ trọng công nghiệp và dịch vụ, giảm tỷ trọng nông nghiệp",
      "Tăng tỷ trọng khai thác tài nguyên thô"
    ],
    "answer": 2,
    "explanation": "Đây là xu hướng tiến bộ, phản ánh sự chuyển đổi từ nền kinh tế dựa vào nông nghiệp sang nền kinh tế dựa trên công nghiệp và dịch vụ hiện đại."
  },
  {
    "question": "Thực tiễn: Việc VinFast xây dựng nhà máy sản xuất ô tô với dây chuyền robot tự động hóa cao thể hiện nội dung nào của CNH, HĐH?",
    "options": [
      "Phát triển nền nông nghiệp sinh thái",
      "Tạo lập những điều kiện cần thiết về mặt tinh thần",
      "Phát triển lực lượng sản xuất dựa trên nền tảng công nghệ cao",
      "Hội nhập văn hóa quốc tế"
    ],
    "answer": 2,
    "explanation": "Việc sử dụng robot và tự động hóa là minh chứng rõ nhất cho việc ứng dụng công nghệ hiện đại để nâng cao năng lực sản xuất."
  },
  {
    "question": "Quan điểm của Đảng ta về CNH, HĐH gắn với phát triển kinh tế tri thức có nghĩa là gì?",
    "options": [
      "Chỉ tập trung phát triển các ngành công nghệ thông tin",
      "Thực hiện CNH, HĐH trên nền tảng của tri thức và công nghệ cao (đi tắt đón đầu)",
      "Bỏ qua phát triển công nghiệp nặng để làm dịch vụ",
      "Ưu tiên xuất khẩu lao động có trình độ cao"
    ],
    "answer": 1,
    "explanation": "Điều này có nghĩa là không đi tuần tự từ công nghiệp cơ khí rồi mới đến công nghệ cao, mà kết hợp ngay công nghệ hiện đại vào quá trình phát triển."
  },
  {
    "question": "Khái niệm “Công nghiệp hóa” được hiểu là quá trình chuyển đổi căn bản các hoạt động sản xuất từ sử dụng…",
    "options": [
      "Lao động thủ công sang lao động sử dụng máy móc",
      "Máy móc thô sơ sang máy móc tự động hóa",
      "Lao động nông nghiệp sang lao động dịch vụ",
      "Năng lượng hóa thạch sang năng lượng tái tạo"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "question": "Trong các yếu tố sau, yếu tố nào đóng vai trò là “điều kiện tiên quyết” (môi trường) để thực hiện thành công CNH, HĐH?",
    "options": [
      "Ổn định chính trị – xã hội",
      "Có nhiều tài nguyên khoáng sản",
      "Dân số đông",
      "Vị trí địa lý thuận lợi"
    ],
    "answer": 0,
    "explanation": "Nếu không có sự ổn định về chính trị và xã hội, các chính sách kinh tế dài hạn như CNH, HĐH không thể triển khai và thu hút đầu tư."
  },
  {
    "question": "Việc nông dân sử dụng điện thoại thông minh để tưới tiêu tự động và theo dõi giá cả thị trường là biểu hiện của quá trình nào?",
    "options": [
      "Hiện đại hóa nông nghiệp và nông thôn",
      "Công nghiệp hóa nông nghiệp",
      "Đô thị hóa nông thôn",
      "Thương mại hóa sản phẩm"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "question": "Tính tất yếu của CNH, HĐH ở Việt Nam còn xuất phát từ yêu cầu nào về mặt quốc phòng – an ninh?",
    "options": [
      "Tăng cường nhập khẩu vũ khí",
      "Xây dựng cơ sở vật chất kỹ thuật để củng cố tiềm lực quốc phòng",
      "Mở rộng quan hệ ngoại giao quân sự",
      "Giảm bớt ngân sách cho quân đội"
    ],
    "answer": 1,
    "explanation": "Để bảo vệ tổ quốc trong tình hình mới, cần có nền công nghiệp quốc phòng hiện đại và kinh tế vững mạnh, điều này chỉ có được qua CNH, HĐH."
  },
  {
    "question": "Tại sao nói CNH, HĐH tạo điều kiện vật chất để xây dựng nền văn hóa mới và con người mới XHCN?",
    "options": [
      "Vì nó giúp tăng thu nhập để người dân đi du lịch nhiều hơn",
      "Vì nó xóa bỏ hoàn toàn các phong tục tập quán cũ",
      "Vì nó nâng cao đời sống vật chất, là tiền đề phát triển đời sống tinh thần",
      "Vì nó bắt buộc mọi người phải làm việc theo tác phong công nghiệp"
    ],
    "answer": 2,
    "explanation": "Vật chất quyết định ý thức. Cơ sở hạ tầng hiện đại, kinh tế phát triển là nền tảng để đầu tư cho giáo dục, y tế, văn hóa và nâng cao dân trí."
  },
  {
    "question": "Mô hình CNH của Việt Nam khác biệt cơ bản với mô hình CNH cổ điển (thế kỷ XVIII–XIX) ở điểm nào?",
    "options": [
      "Tiến hành tuần tự từ công nghiệp nhẹ đến công nghiệp nặng",
      "Dựa hoàn toàn vào vốn vay nước ngoài",
      "Vừa tuần tự, vừa nhảy vọt, kết hợp CNH với HĐH",
      "Chỉ tập trung vào xuất khẩu nông sản"
    ],
    "answer": 2,
    "explanation": "Việt Nam không chờ xong CNH rồi mới HĐH, mà tận dụng lợi thế người đi sau để ứng dụng ngay công nghệ mới (nhảy vọt) song song với phát triển cơ bản (tuần tự)."
  },
  {
    "question": "Thách thức lớn nhất đặt ra cho nguồn nhân lực Việt Nam trong quá trình hội nhập và CNH, HĐH hiện nay là gì?",
    "options": [
      "Thiếu sức khỏe thể chất",
      "Thiếu kỹ năng mềm, trình độ chuyên môn và ngoại ngữ",
      "Số lượng lao động quá ít",
      "Người lao động không muốn làm việc trong nhà máy"
    ],
    "answer": 1,
    "explanation": "Trong nền kinh tế tri thức và hội nhập, chất lượng nhân lực (kỹ năng, chuyên môn, khả năng thích ứng) là rào cản lớn nhất để tiếp cận công nghệ cao."
  },
  {
    "question": "Nội dung “Hoàn thiện thể chế kinh tế thị trường định hướng xã hội chủ nghĩa” đóng vai trò gì trong quá trình CNH, HĐH?",
    "options": [
      "Là mục tiêu cuối cùng của CNH, HĐH",
      "Là tiền đề và động lực thúc đẩy CNH, HĐH",
      "Là giải pháp kỹ thuật thuần túy",
      "Chỉ quan trọng đối với doanh nghiệp nhà nước"
    ],
    "answer": 1,
    "explanation": "Một thể chế tốt, minh bạch, thông thoáng sẽ huy động tối đa nguồn lực, khuyến khích đổi mới sáng tạo, từ đó thúc đẩy CNH, HĐH thành công."
  },
  {
    "question": "Mục tiêu cơ bản của công nghiệp hóa, hiện đại hóa ở Việt Nam là biến nước ta thành một nước như thế nào?",
    "options": [
      "Có nền nông nghiệp hiện đại đứng đầu thế giới",
      "Có nền công nghiệp hiện đại, thu nhập trung bình cao (hướng tới thu nhập cao)",
      "Trở thành cường quốc quân sự trong khu vực",
      "Trở thành công xưởng gia công cho toàn thế giới"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "question": "“Chuyển đổi số quốc gia” trong giai đoạn hiện nay thực chất là một nội dung quan trọng của quá trình nào?",
    "options": [
      "Công nghiệp hóa truyền thống",
      "Nông nghiệp hóa",
      "Đô thị hóa tự phát",
      "Hiện đại hóa nền kinh tế"
    ],
    "answer": 3,
    "explanation": ""
  },
  {
    "question": "Trong quá trình CNH, HĐH, vai trò của Nhà nước là gì?",
    "options": [
      "Can thiệp trực tiếp vào mọi hoạt động sản xuất kinh doanh của doanh nghiệp",
      "Đứng ngoài cuộc, để thị trường tự điều tiết hoàn toàn",
      "Định hướng, xây dựng và hoàn thiện thể chế, tạo môi trường pháp lý",
      "Chỉ quản lý các doanh nghiệp nhà nước"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "question": "CNH, HĐH gắn với “Tăng trưởng xanh” và “Phát triển bền vững” đòi hỏi chúng ta phải chú ý điều gì?",
    "options": [
      "Tăng trưởng kinh tế bằng mọi giá, chấp nhận ô nhiễm trước, xử lý sau",
      "Kết hợp chặt chẽ giữa phát triển kinh tế với bảo vệ môi trường và công bằng xã hội",
      "Hạn chế mở rộng các nhà máy công nghiệp",
      "Chỉ tập trung phát triển du lịch sinh thái"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "question": "Một trong những tiền đề quan trọng về “vốn” để thực hiện CNH, HĐH ở Việt Nam là kết hợp nguồn lực nào?",
    "options": [
      "Chỉ sử dụng nguồn vốn từ ngân sách nhà nước",
      "Chỉ dựa vào nguồn vốn vay ODA và FDI",
      "Kết hợp nguồn vốn trong nước (nội lực) và nguồn vốn nước ngoài (ngoại lực)",
      "In thêm tiền để đầu tư xây dựng cơ bản"
    ],
    "answer": 2,
    "explanation": ""
  }
]

let quizQuestions = [];
let current = 0;
let score = 0;

function shuffleArray(arr) {
    const newArr = [...arr]; // copy để không phá mảng gốc
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}



document.getElementById('start-quiz-btn').onclick = function() {
    current = 0;
    score = 0;

    // ✅ tạo bộ câu hỏi 5 câu random
    quizQuestions = shuffleArray(questions).slice(0, 5);

    document.getElementById('quiz-result').style.display = 'none';
    this.style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
};

function showQuestion() {
    // ✅ nếu vì lý do nào đó quizQuestions rỗng thì tạo lại
    if (!quizQuestions || quizQuestions.length === 0) {
        quizQuestions = shuffleArray(questions).slice(0, 5);
    }

    const q = quizQuestions[current];
    const container = document.getElementById('quiz-container');

    if (!q) { // tránh crash
        showResult();
        return;
    }

    container.innerHTML = `
        <div class="quiz-question">
            <div class="quiz-q">${current + 1}. ${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <label>
                        <input type="radio" name="q" value="${i}">
                        ${opt}
                    </label>
                `).join('<br>')}
            </div>
            <button id="next-btn" disabled>Trả lời</button>
        </div>
    `;

    container.querySelectorAll('input[type=radio]').forEach(input => {
        input.onchange = () => container.querySelector('#next-btn').disabled = false;
    });

    container.querySelector('#next-btn').onclick = function() {
        const selectedEl = container.querySelector('input[name="q"]:checked');
        if (!selectedEl) return;

        const selected = parseInt(selectedEl.value, 10);
        if (selected === q.answer) score += 5;

        current++;
        // ✅ phải so với quizQuestions.length
        if (current < quizQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    };
}

function showResult() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-result').innerText = `Bạn đã hoàn thành! Tổng điểm: ${score}/25`;
    document.getElementById('start-quiz-btn').style.display = 'block';
}

// Smooth scroll to section - giữ tất cả nội dung hiển thị
document.querySelectorAll('#sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

