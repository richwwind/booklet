import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs"; // Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

const file = document.getElementById("fileInput");

var fileContent = '';
let currentPDF =  {};

function resetcurpdf(){
    currentPDF = {
        file: null,
        countOfPages: 0,
        currentPage: 1,
        zoom: 1.5
    }
}

function readPDF() {
    // create file and read file
    const inputf = file.files[0];
    const reader = new FileReader();

    //read file
    reader.readAsDataURL(inputf);
    reader.onload = () => {
        loadPDF(reader.result);
    }
}


async function loadPDF(data){
    resetcurpdf();
    const pdffile = await pdfjsLib.getDocument(data).promise;
    // pdffile.promise.then(pdf => {
    //     currentPDF.file = pdf;
    //     currentPDF.countOfPages = pdf.numPages;
    //     currentPDF.file.getPage(currentPDF.currentPage).then(page => {
    //     })
    // })
    let pages = pdffile.numPages;
    for(let i = 1;i<=pages;i++){
        let page = await pdffile.getPage(i);
        let txt = await page.getTextContent();
        let text = txt.items.map((s)=>s.str).join(" ");
        console.log(text);
    }

}

// function parsePDF(data) {
//     pdfjsLib.getDocument(data).promise.then(function(pdf) {
//         let numPages = pdf.numPages;
//         let pdfContent = '';

//         for (let i = 1; i <= numPages; i++) {
//             pdf.getPage(i).then(function(page) {
//                 page.getTextContent().then(function(textContent) {
//                     textContent.items.forEach(function(textItem) {
//                         pdfContent += textItem.str + ' ';
//                     });

//                     // Lưu nội dung của từng trang vào biến fileContent
//                     fileContent += `Trang ${i}: ${pdfContent}\n`;
//                     pdfContent = ''; // Reset nội dung cho trang tiếp theo

//                     // In nội dung lên console khi hoàn thành việc đọc tất cả các trang
//                     if (i === numPages) {
//                         console.log(fileContent);
//                     }
//                 });
//             });
//         }
//     }, function(error) {
//         console.error('Lỗi khi mở file PDF:', error);
//     });
// }

function readWord() {
    fileContent = ''; // Reset fileContent
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(readerEvent) {
            var arrayBuffer = readerEvent.target.result;

            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(function(result) {
                    fileContent = result.value;

                    // In nội dung lên console
                    console.log(fileContent);
                })
                .catch(function(err) {
                    console.log(err);
                    alert('Đã xảy ra lỗi khi chuyển đổi file. Vui lòng thử lại.');
                });
        };
        reader.readAsArrayBuffer(file);
    }
}

let text;


async function run() {
    document.getElementById('loading').innerHTML = `
    <span>Loading...</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
    `;

    const numQuestions = document.getElementById('num-questions').value;
    const type = document.getElementById('question-type').value;
    let prompt =""

    if (type === "Multiple Choice") {
        prompt = `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${fileContent}. Trong 4 đáp án của từng câu, chỉ có 1 đáp án true và 3 đáp án false. Đáp án true là ngẫu nhiên trong 4 đáp án 1, 2, 3, 4. Cấu trúc nó sẽ nên như này (và chỉ promt ra nội dung câu hỏi dựa theo cấu trúc, ko nên thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
    [
        { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
    ];`;
    } else if (type === "Multiple Resposne") {
        prompt = `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${fileContent}. Trong 4 đáp án của từng câu, có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng. Đáp án đúng sẽ được sắp xếp ngẫu nhiên trong 4 đáp án. Cấu trúc câu hỏi như sau (chỉ in ra nội dung câu hỏi theo cấu trúc này, không thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
    [
        { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] }
    ];`;
    } else if (type === "True or False") {
       prompt = `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${fileContent}. Trong 4 đáp án của từng câu, có nhiều đáp án đúng trong 4 đáp án và có ít nhất có 1 đáp án sai trong 4 đáp án. Đáp án true là ngẫu nhiên trong 4 đáp án 1, 2, 3, 4. Cấu trúc nó sẽ nên như này (và chỉ promt ra nội dung câu hỏi dựa theo cấu trúc, ko nên thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
    [
        { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
    ]; 
    Lưu ý nếu chỗ nào có kí tự \\ thì hãy thay thành \\\\`;
    }
    

    try {
        const result = await model.generateContentStream(prompt);
        const response = await result.response;
        text = await response.text();
        document.getElementById('loading').innerHTML = "Done!";
    } catch (error) {
        console.error("Error generating content:", error);
    }
    console.log(prompt);
}

let quizArray; // Biến lưu trữ dữ liệu câu hỏi
let jsonDataLoaded = false; // Biến cờ để theo dõi xem dữ liệu đã được tải hay chưa

function get() {
    const stringtext = text.toString();
    console.log(stringtext);
    let jsonData = cleanJsonString(stringtext);
    if (jsonData) {
        quizArray = JSON.parse(jsonData);
        console.log(quizArray);
        console.log(typeof quizArray);
        if (quizArray.length != document.getElementById('num-questions').value) {
            console.error("The generated quiz does not contain the correct number of questions.");
        }
        renderQuiz(quizArray);
    } else {
        console.error("Failed to clean JSON string");
    }
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
        return JSON.stringify(parsedJson, null, 2);
    } catch (e) {
        console.error("Invalid JSON string", e);
        return null;
    }
}

document.getElementById('get').addEventListener('click', get);

document.getElementById('submit').addEventListener('click', run);

document.getElementById('pdf').addEventListener('click', readPDF);

document.getElementById('word').addEventListener('click', readWord);