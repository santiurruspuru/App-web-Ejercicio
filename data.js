const appData = {
    questions: [
        {
            id: "u_name",
            text: "¿Cúal es tu nombre?",
            type: "text",
            category: "perfil"
        },
        {
            id: "u_basic",
            text: "Cuéntanos sobre ti",
            type: "profile_grid",
            fields: [
                { id: "u_age", label: "Edad", type: "number" },
                { id: "u_sex", label: "Sexo", type: "select", options: ["Masculino", "Femenino", "Otro"] },
                { id: "u_weight", label: "Peso (kg)", type: "number" },
                { id: "u_height", label: "Altura (cm)", type: "number" }
            ],
            category: "perfil"
        },
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
            id: "q_meds",
            text: "¿Tomas alguna medicación actualmente?",
            type: "select",
            options: ["Sí", "No"],
            category: "salud"
        },
        {
            id: "q_meds_detail",
            text: "¿Para qué es la medicación? (Ej: hipertensión, asma...)",
            type: "text",
            condition: { q_meds: "Sí" },
            category: "salud"
        },
        {
            id: "q_substances",
            text: "¿Consumes habitualmente alguna de estas sustancias?",
            type: "multiselect",
            options: ["Tabaco", "Alcohol", "Marihuana", "Otras", "Ninguna"],
            category: "salud"
        },
        {
            id: "q_acc",
            text: "¿De qué accesorios dispones en casa?",
            type: "multiselect",
            options: ["Mancuernas", "Bandas elásticas", "Esterilla", "Fitball", "Ninguno"],
            category: "hábitos"
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
            id: "q7",
            text: "¿Trabajas sentado más de 6 horas al día?",
            type: "select",
            options: ["Sí", "No"],
            category: "trabajo"
        },
        {
            id: "q12",
            text: "¿Sufres de estrés laboral significativo?",
            type: "select",
            options: ["Sí, constante", "A veces", "No"],
            category: "trabajo"
        },
        {
            id: "q20",
            text: "¿Estás listo para comprometerte con tu bienestar?",
            type: "select",
            options: ["Sí", "¡Totalmente!"],
            category: "objetivos"
        }
    ],
    routines: {
        no_impact: [
            {
                id: "e1",
                name: "Movilidad Gato-Camello",
                duration: "2 min",
                benefits: "Salud espinal",
                description: "En cuadrupedia, arquea suavemente la espalda mientras inhalas y redondéala al exhalar. Ideal para aliviar hernias y rigidez.",
                img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
                theory: "Este ejercicio moviliza todas las vértebras. Reduce la presión intradiscal y mejora la lubricación de las articulaciones de la espalda."
            },
            {
                id: "e2",
                name: "Respiración Diafragmática",
                duration: "3 min",
                benefits: "Core & Sistema Nervioso",
                description: "Tumbado boca arriba, coloca una mano en el pecho y otra en el abdomen. Inhala haciendo que solo suba la del abdomen.",
                img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
                theory: "Activa el nervio vago, reduciendo los niveles de cortisol y fortaleciendo el transverso del abdomen sin impacto."
            },
            {
                id: "e3",
                name: "Puente de Glúteo Suave",
                duration: "3 min",
                benefits: "Estabilidad Lumbar",
                description: "Eleva la pelvis manteniendo los hombros apoyados. No fuerces la altura, céntrate en activar el glúteo.",
                img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400",
                theory: "Glúteos fuertes actúan como un 'escudo' para tu espalda baja, quitándole carga a las vértebras lumbares."
            },
            {
                id: "e4",
                name: "Apertura de Pecho",
                duration: "2 min",
                benefits: "Postura & Hombros",
                description: "De pie, apoya el antebrazo en el marco de una puerta y gira suavemente el cuerpo hacia el lado contrario.",
                img: "https://images.unsplash.com/photo-1549576490-b0b4831da60a?auto=format&fit=crop&q=80&w=400",
                theory: "Compensa las horas de oficina/sentado. Un pecho abierto permite una mejor respiración y reduce la tensión cervical."
            }
        ],
        advice: {
            substances: {
                marihuana: "El consumo de marihuana puede afectar tu ciclo de sueño profundo y coordinación. Te recomendamos evitarlo antes de entrenar y buscar momentos de conciencia plena natural.",
                alcohol: "El alcohol deshidrata y dificulta la recuperación muscular. Intenta limitar su consumo a eventos sociales puntuales.",
                general: "El enfoque de esta app es el bienestar integral. Si sientes que el consumo de sustancias es un obstáculo, consulta con un profesional."
            },
            medication: "Recuerda siempre seguir las indicaciones de tu médico sobre el ejercicio. Estas rutinas son de bajo impacto, pero tu salud es lo primero.",
            habits: [
                "Intenta caminar 10 min después de cada comida.",
                "Mantén una planta cerca de tu lugar de trabajo para mejorar el aire.",
                "Higiene digital: apaga pantallas 1 hora antes de dormir."
            ]
        }
    },
    chatbot: {
        welcome: "Hola, soy tu guía de bienestar. Estoy aquí para escucharte y apoyarte, ya sea con tu plan de entrenamiento o si quieres hablar sobre consumos que te preocupan. ¿En qué puedo ayudarte hoy?",
        knowledge: [
            {
                keywords: ["consumo", "problema", "adicción", "droga", "sustancia"],
                response: "Los consumos problemáticos afectan nuestra salud y relaciones. No estás solo/a. Lo más importante es que busques un abordaje integral que incluya salud mental y física."
            },
            {
                keywords: ["dejar", "cesación", "parar", "cortar"],
                response: "Para dejar un consumo, es clave elegir un 'Día D', limpiar tu entorno de tentaciones y apoyarte en tus seres queridos. ¿Te gustaría establecer una meta hoy?"
            },
            {
                keywords: ["reducir", "limitar", "metas"],
                response: "Una buena estrategia es establecer metas realistas, registrar cuándo consumes para identificar disparadores y cambiar rutinas por actividades saludables como el ejercicio."
            },
            {
                keywords: ["antojo", "impulso", "ganas", "craving"],
                response: "Los antojos son intensos pero pasajeros. Si sientes el impulso, intenta esperar 15 minutos, respira profundo e hidrátate bien. ¡Tú puedes!"
            },
            {
                keywords: ["ayuda", "teléfono", "donde", "sedronar", "141"],
                response: "En Argentina, puedes llamar a la Línea 141 (SEDRONAR) las 24hs. Es gratuito y anónimo. También está la línea de Salud Mental: 0800-999-0091."
            },
            {
                keywords: ["entrenamiento", "ejercicio", "dolor", "lesion"],
                response: "Tu plan está diseñado para ser de bajo impacto. Si sientes dolor persistente, descansa y consulta con un profesional. El ejercicio suave ayuda a regular el ánimo."
            },
            {
                keywords: ["marihuana", "porro", "faso"],
                response: "La marihuana puede afectar tu sueño profundo y coordinación. Si buscas mejorar tu bienestar, intenta reducir su uso especialmente antes de descansar o entrenar."
            }
        ],
        fallback: "Te escucho. Intenta contarme un poco más o pregúntame sobre metas, consejos de salud o recursos de ayuda."
    }
};

export default appData;
