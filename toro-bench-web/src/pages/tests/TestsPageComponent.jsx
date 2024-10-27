import { useNavigate } from "react-router-dom";

export const TestPageComponent = () => {

    const navigate = useNavigate();

    return (
        <section className="background">
            <h1 className="best-devices gradient-text">Додаткові тести</h1>
            <div className="test-container">
                <div className="test--container-image">
                    <div style={{ background: 'url("./internet.png")' }} alt="Internet Speed" className="test-internet"></div>
                </div>
                <div className="test--container-info">
                    <h3>Швидкість інтернету</h3>
                    <p> 
Цей тест швидко вимірює швидкість завантаження та вивантаження в Мбіт/с, передаючи дані на наші сервери та з них.


</p>
                    <button onClick={() => navigate('/internet')}>Відкрити</button>
                </div>
            </div>
            <div className="test-container">
                <div className="test--container-image">
                    <div style={{ background: 'url("./battery.png")' }} alt="Battery test" className="test-internet"></div>
                </div>
                <div className="test--container-info">
                    <h3>Час автономної роботи</h3>
                    <p> 
Цей тест оцінює час роботи акумулятора вашого пристрою, виконуючи низку робочих навантажень і вимірюючи, як довго акумулятор працює від одного заряду.


</p>
                    <button onClick={() => navigate('/battery')}>Відкрити</button>
                </div>
            </div>
        </section>
    );
}