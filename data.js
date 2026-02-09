const appData = {
    questions: [
        {
            id: "q1",
            text: "¿Cuál es tu objetivo principal?",
            type: "select",
            options: ["Perder peso", "Ganar movilidad", "Reducir estrés", "Mejorar sueño"],
            category: "objetivos"
        },
        {
            id: "q2",
            text: "¿Tienes alguna lesión previa o dolor crónico?",
            type: "select",
            options: ["Sí", "No"],
            category: "salud"
        },
        {
            id: "q3",
            text: "Específicamente, ¿tienes alguna de estas?",
            type: "multiselect",
            condition: { q2: "Sí" },
            options: ["Hernia discal", "Lesión de rodilla", "Dolor lumbar", "Cervicalgía"],
            category: "salud"
        },
        {
            id: "q4",
            text: "¿Cómo calificarías tu nivel de actividad física actual?",
            type: "select",
            options: ["Sedentario", "Ligero", "Moderado", "Intenso"],
            category: "hábitos"
        },
        {
            id: "q5",
            text: "¿Cuántas horas duermes en promedio?",
            type: "number",
            min: 0,
            max: 24,
            category: "hábitos"
        },
        {
            id: "q6",
            text: "¿Te despiertas cansado a menudo?",
            type: "select",
            options: ["Siempre", "A veces", "Nunca"],
            category: "hábitos"
        },
        {
            id: "q7",
            text: "¿Trabajas sentado más de 6 horas al día?",
            type: "select",
            options: ["Sí", "No"],
            category: "trabajo"
        },
        {
            id: "q8",
            text: "¿Sientes tensión en hombros o cuello después del trabajo?",
            type: "select",
            options: ["Sí", "No"],
            category: "trabajo"
        },
        {
            id: "q9",
            text: "¿Cuántos vasos de agua bebes al día?",
            type: "number",
            min: 0,
            max: 20,
            category: "hábitos"
        },
        {
            id: "q10",
            text: "¿Consumes alimentos procesados frecuentemente?",
            type: "select",
            options: ["Diario", "3-4 veces/semana", "Rara vez"],
            category: "salud"
        },
        {
            id: "q11",
            text: "¿Fumas o consumes alcohol regularmente?",
            type: "select",
            options: ["Ambos", "Solo tabaco", "Solo alcohol", "Ninguno"],
            category: "salud"
        },
        {
            id: "q12",
            text: "¿Sufres de estrés laboral significativo?",
            type: "select",
            options: ["Sí, constante", "A veces", "No"],
            category: "trabajo"
        },
        {
            id: "q13",
            text: "¿Te gustaría incorporar meditación en tu rutina?",
            type: "select",
            options: ["Sí", "No"],
            category: "objetivos"
        },
        {
            id: "q14",
            text: "¿Tienes poco tiempo para cocinar?",
            type: "select",
            options: ["Sí", "No"],
            category: "hábitos"
        },
        {
            id: "q15",
            text: "¿Prefieres ejercicios en la mañana o tarde?",
            type: "select",
            options: ["Mañana", "Tarde/Noche"],
            category: "hábitos"
        },
        {
            id: "q16",
            text: "¿Tienes acceso a un gimnasio o prefieres casa?",
            type: "select",
            options: ["Gimnasio", "Casa"],
            category: "hábitos"
        },
        {
            id: "q17",
            text: "¿Te interesa el acompañamiento terapéutico/psicológico?",
            type: "select",
            options: ["Sí", "No"],
            category: "objetivos"
        },
        {
            id: "q18",
            text: "¿Has consultado a un especialista por tus dolores?",
            type: "select",
            condition: { q2: "Sí" },
            options: ["Sí", "No"],
            category: "salud"
        },
        {
            id: "q19",
            text: "¿Cuál es tu mayor obstáculo para mantener hábitos saludables?",
            type: "select",
            options: ["Falta de tiempo", "Falta de motivación", "Dolor físico", "Estrés"],
            category: "objetivos"
        },
        {
            id: "q20",
            text: "¿Estás listo para comprometerte 15 min al día?",
            type: "select",
            options: ["Sí", "¡Totalmente!"],
            category: "objetivos"
        }
    ],
    routines: {
        no_impact: [
            { id: "e1", name: "Movilidad de Gato-Camello", duration: "2 min", benefits: "Espalda baja", description: "En cuadrupedia, arquea y redondea la espalda suavemente." },
            { id: "e2", name: "Respiración Diafragmática", duration: "3 min", benefits: "Relajación/Core", description: "Tumbado boca arriba, respira expandiendo el abdomen." },
            { id: "e3", name: "Puente de Glúteo Suave", duration: "3 min", benefits: "Core/Glúteos", description: "Eleva la pelvis sin forzar la espalda." },
            { id: "e4", name: "Estiramiento de Cuello", duration: "2 min", benefits: "Cervicales", description: "Movimientos laterales lentos." },
            { id: "e5", name: "Apertura de Pecho en Puerta", duration: "3 min", benefits: "Postura", description: "Apoya brazos en marco de puerta y adelanta el pecho." }
        ],
        simple_nutrition: {
            high_protein: ["Huevos revueltos con espinacas", "Pollo a la plancha con puré", "Yogur griego con nueces"],
            easy_prep: ["Ensalada de legumbres de bote", "Tostada de aguacate", "Batido de frutas y avena"],
            hydration_tip: "Bebe un vaso de agua al despertar y antes de cada comida."
        },
        sleep_protocol: [
            "No pantallas 45 min antes de dormir",
            "Temperatura de habitación fresca (18-20°C)",
            "Cena ligera 2 horas antes",
            "Luz tenue por la noche"
        ],
        therapy_guide: "Busca 5 min de silencio absoluto al día. Si sientes estrés constante, considera una sesión de consulta gratuita online."
    }
};

export default appData;
