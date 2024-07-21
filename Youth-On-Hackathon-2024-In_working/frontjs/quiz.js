import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";
const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";

const genAI = new GoogleGenerativeAI(API_KEY);

let model;
(async () => {
    model = await genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
})();

let text,final_s;

async function run() {
    document.getElementById('loading').innerHTML = `
    <span>Loading...</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
    `;

    const numQuestions = document.getElementById('num-questions').value;
    const type = document.getElementById('question-type').value;
    let prompt;
    let pre_prompt = [
    
        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${document.getElementById('prompt').value}. Trong 4 đáp án của từng câu, chỉ có 1 đáp án true và 3 đáp án false. Đáp án true là ngẫu nhiên trong 4 đáp án 1, 2, 3, 4. Cấu trúc nó sẽ nên như này (và chỉ promt ra nội dung câu hỏi dựa theo cấu trúc, ko nên thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
        [
            { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        ]; `,

        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${document.getElementById('prompt').value}. Trong 4 đáp án của từng câu, có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng. Đáp án đúng sẽ được sắp xếp ngẫu nhiên trong 4 đáp án. Cấu trúc câu hỏi như sau (chỉ in ra nội dung câu hỏi theo cấu trúc này, không thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
        [
            { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] }
        ];`,

        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, dựa trên nội dung hoặc chủ đề là: ${document.getElementById('prompt').value}. Mỗi câu có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng, được phân bố ngẫu nhiên trong 4 đáp án. Cấu trúc dữ liệu như sau (chỉ xuất nội dung câu hỏi theo cấu trúc này, không thêm thông tin khác):
        [
            { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] }
        ];`
    ]

    let t = ["Multiple Choice","Multiple Response","True or False"];
    prompt = pre_prompt[t.indexOf(type)];

    try {
        const result = await model.generateContentStream(prompt);
        const response = await result.response;
        text = await response.text();
        let temp = cleanJsonString(text);
        final_s = temp;

        if(numQuestions - final_s.length > 0){
            let config_promp = pre_prompt[t.indexOf(type)];
            config_promp = config_promp.replace(`${numQuestions}`,`${numQuestions-final_s.length}`);
            const rs = await model.generateContentStream(config_promp);
            const rp = await rs.response;
            text = await rp.text();
            temp = cleanJsonString(text);
            final_s = final_s.concat(temp);
        }

        document.getElementById('loading').innerHTML = "Done!";
    } catch (error) {
        console.error("Error generating content:", error);
    }
    console.log(prompt);
}

let quizArray; // Biến lưu trữ dữ liệu câu hỏi
let jsonDataLoaded = false; // Biến cờ để theo dõi xem dữ liệu đã được tải hay chưa

function get() {
    // const stringtext = text.toString();
    // console.log(stringtext);
    // let jsonData = cleanJsonString(stringtext);
    // if (jsonData) {
    //     quizArray = JSON.parse(jsonData);
    //     console.log(quizArray);
    //     console.log(typeof quizArray);
    //     if (quizArray.length != document.getElementById('num-questions').value) {
    //         console.error("The generated quiz does not contain the correct number of questions.");
    //     }
    //     renderQuiz(quizArray);
    // } else {
    //     console.error("Failed to clean JSON string");
    // }
    renderQuiz(final_s);
}

function renderQuiz(quizData) {
    const type1 = document.getElementById('question-type').value;
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Clear previous quiz content

    if (type1 === "Multiple Response") {
        quizData.forEach((quiz, quizIndex) => {
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');

            const quizTitle = document.createElement('h3');
            quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
            quizDiv.appendChild(quizTitle);

            const answersDiv = document.createElement('div');
            answersDiv.classList.add('answers');

            quiz.answers.forEach((answer, answerIndex) => {
                const answerLabel = document.createElement('label');
                answerLabel.classList.add('answer-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `quiz${quizIndex}_answer`;
                checkbox.value = answerIndex;

                const answerText = document.createElement('span');
                answerText.textContent = answer.text;
                answerLabel.appendChild(checkbox);
                answerLabel.appendChild(answerText);

                const resultText = document.createElement('span');
                resultText.classList.add('result-text');
                answerLabel.appendChild(resultText);

                checkbox.addEventListener('change', () => {
                    const allLabels = answersDiv.querySelectorAll('label');
                    allLabels.forEach(label => {
                        const resultSpan = label.querySelector('.result-text');
                        if (label === answerLabel) {
                            if (checkbox.checked) {
                                if (answer.correct) {
                                    resultSpan.textContent = 'Correct!';
                                    resultSpan.classList.add('correct-text');
                                } else {
                                    resultSpan.textContent = 'Wrong!';
                                    resultSpan.classList.add('incorrect-text');
                                }
                            } else {
                                resultSpan.textContent = '';
                                resultSpan.classList.remove('correct-text', 'incorrect-text');
                            }
                        }
                    });
                });

                answersDiv.appendChild(answerLabel);
            });

            quizDiv.appendChild(answersDiv);
            container.appendChild(quizDiv);
        });
    } else if (type1 === "Multiple Choice") {
        quizData.forEach((quiz, quizIndex) => {
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');

            const quizTitle = document.createElement('h3');
            quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
            quizDiv.appendChild(quizTitle);

            const answersDiv = document.createElement('div');
            answersDiv.classList.add('answers');

            quiz.answers.forEach((answer, answerIndex) => {
                const answerLabel = document.createElement('label');
                answerLabel.classList.add('answer-item');

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `quiz${quizIndex}_answer`;
                radio.value = answerIndex;

                const answerText = document.createElement('span');
                answerText.textContent = answer.text;
                answerLabel.appendChild(radio);
                answerLabel.appendChild(answerText);

                const resultText = document.createElement('span');
                resultText.classList.add('result-text');
                answerLabel.appendChild(resultText);

                radio.addEventListener('change', () => {
                    const allLabels = answersDiv.querySelectorAll('label');
                    allLabels.forEach(label => {
                        const resultSpan = label.querySelector('.result-text');
                        if (label === answerLabel) {
                            if (answer.correct) {
                                resultSpan.textContent = 'Correct!';
                                resultSpan.classList.add('correct-text');
                            } else {
                                resultSpan.textContent = 'Wrong!';
                                resultSpan.classList.add('incorrect-text');
                            }
                        } else {
                            resultSpan.textContent = '';
                            resultSpan.classList.remove('correct-text', 'incorrect-text');
                        }
                    });
                });

                answersDiv.appendChild(answerLabel);
            });

            quizDiv.appendChild(answersDiv);
            container.appendChild(quizDiv);
        });
    } else if (type1 === "True or False") {
        quizData.forEach((quiz, quizIndex) => {
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');

            const quizTitle = document.createElement('h3');
            quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
            quizDiv.appendChild(quizTitle);

            const answersDiv = document.createElement('div');
            answersDiv.classList.add('answers');

            quiz.answers.forEach((answer, answerIndex) => {
                const answerLabel = document.createElement('label');
                answerLabel.classList.add('answer-item');

                const answerText = document.createElement('span');
                answerText.textContent = answer.text;
                answerLabel.appendChild(answerText);

                const trueRadio = document.createElement('input');
                trueRadio.type = 'radio';
                trueRadio.name = `quiz${quizIndex}_answer${answerIndex}`;
                trueRadio.value = 'true';

                const trueLabel = document.createElement('label');
                trueLabel.textContent = 'True';
                trueLabel.appendChild(trueRadio);
                answerLabel.appendChild(trueLabel);

                const falseRadio = document.createElement('input');
                falseRadio.type = 'radio';
                falseRadio.name = `quiz${quizIndex}_answer${answerIndex}`;
                falseRadio.value = 'false';

                const falseLabel = document.createElement('label');
                falseLabel.textContent = 'False';
                falseLabel.appendChild(falseRadio);
                answerLabel.appendChild(falseLabel);

                const resultText = document.createElement('span');
                resultText.classList.add('result-text');
                answerLabel.appendChild(resultText);

                const checkAnswer = () => {
                    const selectedValue = answersDiv.querySelector(`input[name="quiz${quizIndex}_answer${answerIndex}"]:checked`).value;
                    if ((selectedValue === 'true' && answer.correct) || (selectedValue === 'false' && !answer.correct)) {
                        resultText.textContent = 'Correct!';
                        resultText.classList.remove('correct-text', 'incorrect-text');
                        resultText.classList.add('correct-text');
                    } else {
                        resultText.textContent = 'Wrong!';
                        resultText.classList.add('incorrect-text');
                    }
                };

                trueRadio.addEventListener('change', checkAnswer);
                falseRadio.addEventListener('change', checkAnswer);

                answersDiv.appendChild(answerLabel);
            });

            quizDiv.appendChild(answersDiv);
            container.appendChild(quizDiv);
        });
    }
}


function cleanJsonString(json) {
    console.log('Original JSON:', json);
    json = json.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log('Cleaned JSON:', json);
    try {
        let parsedJson = JSON.parse(json);
        return parsedJson;
    } catch (e) {
        console.error("Invalid JSON string", e);
        return null;
    }
}

document.getElementById('get').addEventListener('click', get);

document.getElementById('submit').addEventListener('click', run);