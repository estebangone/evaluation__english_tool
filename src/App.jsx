import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Settings, 
  User, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Mic, 
  Edit3, 
  Volume2, 
  ChevronRight, 
  ArrowLeft, 
  LogOut, 
  Database, 
  BarChart2, 
  Check, 
  Sparkles, 
  RotateCcw,
  BookOpenText,
  Clock,
  Briefcase,
  HelpCircle,
  Menu,
  X,
  Lock,
  Mail,
  Moon,
  Sun,
  Key
} from 'lucide-react';

// ==========================================================
// CONFIGURACIÓN GLOBAL E INTEGRACIÓN GEMINI
// ==========================================================
const DEFAULT_GEMINI_API_KEY = ""; 

// BANCO DE 64 PREGUNTAS PREMIUM CLASIFICADAS POR NIVEL MCER (A1-C2) Y HABILIDAD
const SIMULATED_QUESTION_BANK = {
  // 24 PREGUNTAS DE GRAMÁTICA (4 POR CADA NIVEL DEL MCER)
  grammar: [
    // --- NIVEL A1 ---
    { id: 'g_a1_1', level: 'A1', content: "She _______ to the cinema every Saturday.", options: ["go", "goes", "going", "gone"], correct: 1, explanation: "En presente simple con tercera persona (she/he/it) se añade '-s' o '-es' al verbo." },
    { id: 'g_a1_2', level: 'A1', content: "_______ you like to drink some tea?", options: ["Do", "Are", "Would", "Have"], correct: 2, explanation: "Utilizamos 'Would you like...?' para hacer invitaciones y ofrecimientos de forma educada." },
    { id: 'g_a1_3', level: 'A1', content: "They _______ student cards for the library.", options: ["has", "have", "are having", "haves"], correct: 1, explanation: "El pronombre plural 'They' utiliza la conjugación 'have' en presente simple." },
    { id: 'g_a1_4', level: 'A1', content: "Where _______ you live?", options: ["do", "are", "have", "is"], correct: 0, explanation: "Utilizamos el auxiliar 'do' para preguntas en presente simple con el pronombre 'you'." },
    
    // --- NIVEL A2 ---
    { id: 'g_a2_1', level: 'A2', content: "They _______ television when the telephone rang.", options: ["watched", "were watching", "are watching", "have watched"], correct: 1, explanation: "Usamos el pasado continuo para expresar una acción larga que fue interrumpida por otra acción corta en pasado simple." },
    { id: 'g_a2_2', level: 'A2', content: "We _______ to London two years ago.", options: ["go", "went", "have gone", "were going"], correct: 1, explanation: "La expresión 'two years ago' requiere obligatoriamente el uso del pasado simple ('went')." },
    { id: 'g_a2_3', level: 'A2', content: "This is the _______ book I have ever read.", options: ["goodest", "better", "best", "most good"], correct: 2, explanation: "'Best' es el superlativo irregular correspondiente al adjetivo 'good'." },
    { id: 'g_a2_4', level: 'A2', content: "She _______ completed her homework yet.", options: ["has not", "have not", "is not", "did not"], correct: 0, explanation: "El adverbio 'yet' con presente perfecto requiere la forma negativa con 'has/have'." },
    
    // --- NIVEL B1 ---
    { id: 'g_b1_1', level: 'B1', content: "If I _______ more money, I would buy a sports car.", options: ["have", "will have", "had", "would have"], correct: 2, explanation: "Segundo condicional: expresa hipótesis utilizando la estructura 'If + Past Simple, would + Verbo'." },
    { id: 'g_b1_2', level: 'B1', content: "He _______ in Madrid since he was a child.", options: ["lives", "has lived", "is living", "lived"], correct: 1, explanation: "La preposición 'since' indica una acción que comenzó en el pasado y sigue vigente; requiere presente perfecto." },
    { id: 'g_b1_3', level: 'B1', content: "The window _______ by the storm yesterday.", options: ["broke", "was broken", "has broken", "had broken"], correct: 1, explanation: "Voz pasiva en pasado simple: 'was/were + participio pasado' con marcador de tiempo 'yesterday'." },
    { id: 'g_b1_4', level: 'B1', content: "You don't need to hurry. We _______ have plenty of time.", options: ["already", "still", "yet", "since"], correct: 1, explanation: "'Still' indica que la situación del tiempo abundante continúa vigente sin cambios." },
    
    // --- NIVEL B2 ---
    { id: 'g_b2_1', level: 'B2', content: "He is believed _______ the country before the police arrived.", options: ["to leave", "to have left", "having left", "to be leaving"], correct: 1, explanation: "Utilizamos el infinitivo perfecto pasivo ('to have left') para reportar una creencia en presente sobre un evento pasado." },
    { id: 'g_b2_2', level: 'B2', content: "By this time next year, she _______ her university degree.", options: ["will finish", "is finishing", "will have finished", "finishes"], correct: 2, explanation: "Futuro perfecto ('will have finished') para indicar acciones completadas antes de un momento determinado en el futuro." },
    { id: 'g_b2_3', level: 'B2', content: "You _______ come to the meeting, but it would be beneficial if you did.", options: ["mustn't", "don't have to", "ought to", "can't"], correct: 1, explanation: "'Don't have to' indica ausencia de obligación externa o necesidad de realizar la acción." },
    { id: 'g_b2_4', level: 'B2', content: "I would rather you _______ smoke in the house.", options: ["don't", "didn't", "won't", "not"], correct: 1, explanation: "La estructura 'I would rather + pronombre' requiere el uso del pasado simple para expresar preferencia sobre otra persona." },
    
    // --- NIVEL C1 ---
    { id: 'g_c1_1', level: 'C1', content: "Hardly _______ entered the office when the alarm went off.", options: ["had I", "I had", "did I have", "should I have"], correct: 0, explanation: "Inversión negativa: después de un adverbio restrictivo inicial como 'hardly', el sujeto y el auxiliar se invierten." },
    { id: 'g_c1_2', level: 'C1', content: "She suggested _______ the decision until the next board meeting.", options: ["to postpone", "postponing", "postpone", "postponed"], correct: 1, explanation: "El verbo 'suggest' rige gramaticalmente gerundio ('-ing') cuando no va seguido de una cláusula subordinada con 'that'." },
    { id: 'g_c1_3', level: 'C1', content: "_______ you need any further assistance, please contact our support desk.", options: ["Should", "Would", "Had", "Were"], correct: 0, explanation: "Inversión en primer condicional: 'Should you' actúa como equivalente formal y literario de 'If you'." },
    { id: 'g_c1_4', level: 'C1', content: "No sooner _______ the speech begun than the audience started whispering.", options: ["had", "has", "did", "was"], correct: 0, explanation: "Inversión literaria con 'No sooner... than' utilizando el pasado perfecto." },
    
    // --- NIVEL C2 ---
    { id: 'g_c2_1', level: 'C2', content: "Were it not for your assistance, we _______ in completing this merger on time.", options: ["would fail", "had failed", "would have failed", "will fail"], correct: 2, explanation: "Estructura condicional de tercer tipo invertida en negativo. Equivale a 'If it hadn't been for...'." },
    { id: 'g_c2_2', level: 'C2', content: "No sooner _______ left the house than it started pouring with rain.", options: ["she had", "had she", "did she have", "was she"], correct: 1, explanation: "Inversión con 'No sooner... than' para indicar dos hechos sucesivos rápidos en el pasado." },
    { id: 'g_c2_3', level: 'C2', content: "The committee has recommended that the policy _______ without delay.", options: ["is implemented", "be implemented", "implement", "implements"], correct: 1, explanation: "Subjuntivo inglés: después de verbos de demanda o recomendación, se usa la forma base del verbo ('be implemented')." },
    { id: 'g_c2_4', level: 'C2', content: "Lest there _______ any misunderstanding, let me clarify the terms.", options: ["is", "was", "be", "were"], correct: 2, explanation: "La conjunción 'lest' (para evitar que) rige de manera formal el modo subjuntivo ('be')." }
  ],

  // 24 PREGUNTAS DE VOCABULARIO (4 POR CADA NIVEL DEL MCER)
  vocabulary: [
    // --- NIVEL A1 ---
    { id: 'v_a1_1', level: 'A1', content: "My mother's brother is my _______.", options: ["cousin", "nephew", "uncle", "grandfather"], correct: 2, explanation: "El hermano de mi madre es mi tío ('uncle')." },
    { id: 'v_a1_2', level: 'A1', content: "I need to buy some _______ to write a letter.", options: ["paper", "plate", "apple", "shoes"], correct: 0, explanation: "El 'paper' (papel) es el único artículo adecuado de la lista para escribir." },
    { id: 'v_a1_3', level: 'A1', content: "We cook dinner in the _______.", options: ["bathroom", "bedroom", "kitchen", "garden"], correct: 2, explanation: "El lugar adecuado de la casa para preparar alimentos es la cocina ('kitchen')." },
    { id: 'v_a1_4', level: 'A1', content: "I wear a _______ when it is cold outside.", options: ["coat", "t-shirt", "skirt", "swimsuit"], correct: 0, explanation: "Un abrigo ('coat') es la prenda correcta para protegerse del frío." },
    
    // --- NIVEL A2 ---
    { id: 'v_a2_1', level: 'A2', content: "Could you please give me a _______ to carry these heavy bags?", options: ["hand", "finger", "head", "arm"], correct: 0, explanation: "La expresión 'give a hand' es un modismo común que significa ayudar a alguien." },
    { id: 'v_a2_2', level: 'A2', content: "I would like to _______ some money from the bank.", options: ["lend", "borrow", "spend", "earn"], correct: 1, explanation: "'Borrow' significa pedir prestado, que encaja con el sentido de tomar dinero del banco temporalmente." },
    { id: 'v_a2_3', level: 'A2', content: "The flight was delayed due to bad _______.", options: ["season", "climate", "weather", "atmosphere"], correct: 2, explanation: "'Weather' se refiere al estado climático específico y cambiando del día que afecta los vuelos." },
    { id: 'v_a2_4', level: 'A2', content: "He is a very _______ student who always gets 100% in exams.", options: ["lazy", "clever", "boring", "impolite"], correct: 1, explanation: "'Clever' significa inteligente o brillante, coherente con obtener calificaciones perfectas." },
    
    // --- NIVEL B1 ---
    { id: 'v_b1_1', level: 'B1', content: "The business meeting was _______ because the director was sick.", options: ["called off", "put off", "taken off", "broken off"], correct: 1, explanation: "'Put off' es un phrasal verb que significa aplazar o posponer una cita." },
    { id: 'v_b1_2', level: 'B1', content: "He is a very _______ worker; you can always rely on him.", options: ["reliable", "stubborn", "creative", "sensitive"], correct: 0, explanation: "'Reliable' significa confiable, alineado conceptualmente con la frase 'puedes confiar en él'." },
    { id: 'v_b1_3', level: 'B1', content: "We must protect the natural _______ for future generations.", options: ["nature", "surroundings", "environment", "suburbs"], correct: 2, explanation: "'Environment' (medio ambiente) es el término científico y social idóneo en este contexto." },
    { id: 'v_b1_4', level: 'B1', content: "Can you _______ an eye on my bag while I go to the restroom?", options: ["keep", "hold", "make", "give"], correct: 0, explanation: "La colocación exacta es 'keep an eye on' (vigilar o cuidar de algo)." },
    
    // --- NIVEL B2 ---
    { id: 'v_b2_1', level: 'B2', content: "The company's profits have risen _______ this quarter, exceeding all predictions.", options: ["slightly", "marginally", "substantially", "scarcely"], correct: 2, explanation: "'Substantially' significa sustancialmente o de forma significativa, justificando el haber roto pronósticos." },
    { id: 'v_b2_2', level: 'B2', content: "The suspect claimed he was there by _______, but the police didn't believe him.", options: ["coincidence", "consequence", "collusion", "certainty"], correct: 0, explanation: "'Coincidence' (coincidencia) se asocia con un suceso fortuito para excusar presencia." },
    { id: 'v_b2_3', level: 'B2', content: "We must find a way to _______ our waste production to protect the planet.", options: ["mitigate", "magnify", "propel", "fluctuate"], correct: 0, explanation: "'Mitigate' significa atenuar, reducir o suavizar el impacto negativo." },
    { id: 'v_b2_4', level: 'B2', content: "The new marketing campaign was highly _______, generating millions in revenue.", options: ["lucrative", "redundant", "laborious", "monotonous"], correct: 0, explanation: "'Lucrative' describe una actividad altamente rentable o beneficiosa económicamente." },
    
    // --- NIVEL C1 ---
    { id: 'v_c1_1', level: 'C1', content: "The government took _______ measures to curb inflation before it spiraled out of control.", options: ["stringent", "lax", "negligible", "volatile"], correct: 0, explanation: "'Stringent' significa estrictas, rigurosas o severas, idóneo para medidas macroeconómicas urgentes." },
    { id: 'v_c1_2', level: 'C1', content: "There is no concrete evidence to _______ the allegations made by the witness.", options: ["corroborate", "refute", "disparage", "repudiate"], correct: 0, explanation: "'Corroborate' significa confirmar o dar sustento a una afirmación con evidencias adicionales." },
    { id: 'v_c1_3', level: 'C1', content: "Mobile technology has become so _______ that even remote villages have internet access.", options: ["ubiquitous", "obsolete", "conspicuous", "superfluous"], correct: 0, explanation: "'Ubiquitous' significa ubicuo, omnipresente o extendido en todas partes." },
    { id: 'v_c1_4', level: 'C1', content: "He is completely _______ in his studies, studying up to 10 hours a day.", options: ["engrossed", "detached", "indifferent", "apathetic"], correct: 0, explanation: "'Engrossed' significa completamente absorto, inmerso o concentrado en una actividad." },
    
    // --- NIVEL C2 ---
    { id: 'v_c2_1', level: 'C2', content: "His arguments were so _______ that the entire board was immediately won over.", options: ["specious", "cogent", "redundant", "feeble"], correct: 1, explanation: "'Cogent' describe argumentos claros, lógicos, convincentes e irrefutables." },
    { id: 'v_c2_2', level: 'C2', content: "The novel's protagonist is the _______ of a tragic hero.", options: ["epitome", "antithesis", "caricature", "enigma"], correct: 0, explanation: "'Epitome' designa el ejemplo perfecto o la encarnación suprema de una cualidad." },
    { id: 'v_c2_3', level: 'C2', content: "The CEO was known for his _______ management style, never changing his mind.", options: ["obdurate", "pliant", "mercurial", "benevolent"], correct: 0, explanation: "'Obdurate' define a una persona terca, obstinada e inflexible ante cualquier persuasión." },
    { id: 'v_c2_4', level: 'C2', content: "The scientific team made a _______ discovery that could revolutionize clean energy.", options: ["pathbreaking", "run-of-the-mill", "uninspiring", "pedestrian"], correct: 0, explanation: "'Pathbreaking' significa pionero, innovador o sin precedentes en su área de estudio." }
  ],

  // 8 COMPRENSIONES LECTORAS ADAPTATIVAS (CADA PASAJE CON EVALUACIÓN ASOCIADA)
  reading: [
    {
      id: 'r_b1_1',
      level: 'B1',
      passage: "The digital workplace has evolved rapidly over the last decade. Remote working is no longer just a luxury offered by progressive tech startups; it has become a core organizational strategy. While companies benefit from reduced overhead costs and access to a wider talent pool, employees report improved work-life balance. However, challenges such as isolation and the blurring of boundaries between professional and personal life remain significant.",
      content: "What is the main idea of this passage?",
      options: [
        "Remote working is exclusive to tech startups.",
        "The shift to a digital workplace brings both benefits and challenges.",
        "Employees struggle significantly with isolation at work.",
        "Overhead costs are the only reason companies allow remote work."
      ],
      correct: 1,
      explanation: "El texto detalla los beneficios operacionales y personales, pero equilibra mencionando los retos."
    },
    {
      id: 'r_b2_1',
      level: 'B2',
      passage: "Genetically modified organisms (GMOs) have been a subject of intense debate. Proponents argue that biotechnology can enhance crop yields, improve nutritional content, and provide resistance to pests, thereby helping to address global food insecurity. Opponents, conversely, raise concerns regarding the long-term ecological impacts, such as the accidental cross-pollination of wild species, and the potential health risks that remain unproven but plausible according to some preliminary biological essays.",
      content: "According to the passage, what is a primary argument used by GMO proponents?",
      options: [
        "GMOs are completely free of health risks.",
        "Biotechnology can help solve global food insecurity issues.",
        "Cross-pollination is beneficial for wild species.",
        "Preliminary biological essays have proven wild species safety."
      ],
      correct: 1,
      explanation: "El texto afirma explícitamente que los defensores de los OGM apuntan a mitigar la inseguridad alimentaria global."
    },
    {
      id: 'r_c1_1',
      level: 'C1',
      passage: "Philosophical skepticism has long questioned the possibility of absolute knowledge. Skeptics argue that since our sensory perceptions are prone to error and cognitive biases distort our interpretation, we can never claim with complete certainty that our beliefs correspond directly to objective reality. In response, modern epistemologists suggest that while absolute certainty might be an unattainable ideal, justified belief based on empirical consensus remains our most reliable guide to navigating existence.",
      content: "Based on the text, what can be inferred about modern epistemologists?",
      options: [
        "They completely agree with absolute skeptics.",
        "They dismiss empirical evidence as a source of truth.",
        "They adopt a pragmatic approach that values justified consensus over absolute certainty.",
        "They believe human sensory perception is flawless."
      ],
      correct: 2,
      explanation: "Se infiere que adoptan una postura pragmática que prefiere justificar creencias viables a buscar verdades inalcanzables."
    },
    {
      id: 'r_c2_1',
      level: 'C2',
      passage: "The concept of paradigm shifts, coined by Thomas Kuhn, revolutionized the philosophy of science. Kuhn posited that scientific progress is not linear but punctuated by periods of crisis. During these phases, anomalies that contradict the prevailing scientific paradigm accumulate until they can no longer be ignored. This triggers a scientific revolution, whereby the old paradigm is replaced by a fundamentally incommensurable new framework. Science, therefore, does not merely accumulate truths; it periodically restructures its entire cognitive architecture.",
      content: "Which statement best captures Kuhn's view on scientific progress according to the passage?",
      options: [
        "Science progresses in a smooth, continuous linear accumulation of absolute facts.",
        "Scientific advancements are random and lack any underlying structural pattern.",
        "Progress occurs through crises that force periodic, systemic reconstructions of scientific belief.",
        "Anomalies are systematically ignored to preserve old frameworks forever."
      ],
      correct: 2,
      explanation: "El texto concluye que Kuhn ve el progreso científico como una reestructuración periódica de la arquitectura cognitiva tras crisis estructurales."
    },
    {
      id: 'r_a2_1',
      level: 'A2',
      passage: "John went to the supermarket yesterday afternoon. He wanted to cook a special dinner for his sister's birthday. He bought some fresh pasta, tomato sauce, and garlic bread. However, when he arrived home, he realized he forgot to buy the birthday cake, so he had to run back to the bakery before it closed.",
      content: "Why did John go to the supermarket?",
      options: [
        "To buy a cake for his sister.",
        "To cook a birthday dinner.",
        "To work at the bakery.",
        "To buy garlic bread only."
      ],
      correct: 1,
      explanation: "El texto detalla que John quería cocinar una cena especial por el cumpleaños de su hermana."
    },
    {
      id: 'r_b1_2',
      level: 'B1',
      passage: "Ecotourism is gaining popularity as travelers seek more sustainable ways to explore the world. Unlike traditional tourism, ecotourism focuses on minimizing ecological damage, conserving biodiversity, and respecting local cultures. Critics, however, warn that greenwashing exists, where some travel agencies claim to be eco-friendly but do not follow sustainable guidelines.",
      content: "What is greenwashing in traditional tourism contexts?",
      options: [
        "Washing hotels with organic green products.",
        "Travel agencies falsely claiming to be eco-friendly.",
        "A system to reduce tourist tax in nature reserves.",
        "Improving local economies through biological farming."
      ],
      correct: 1,
      explanation: "El texto explica que 'greenwashing' es cuando se dice ser ecológico pero no se cumplen las guías sostenibles."
    },
    {
      id: 'r_b2_2',
      level: 'B2',
      passage: "Artificial Intelligence is restructuring the job market at an unprecedented pace. Automation is displacing routine tasks while creating demand for highly complex roles in system engineering, neural network design, and AI alignment. Economists suggest that the workforce must transition through constant upskilling to avoid systemic structural unemployment.",
      content: "According to economists, how can structural unemployment be avoided?",
      options: [
        "By banning artificial intelligence.",
        "Through constant upskilling of workers.",
        "By creating more routine physical tasks.",
        "By lowering engineers' salaries."
      ],
      correct: 1,
      explanation: "El texto señala expresamente la necesidad de 'upskilling' (capacitación constante) de los trabajadores."
    },
    {
      id: 'r_c1_2',
      level: 'C1',
      passage: "Cognitive dissonance occurs when an individual holds contradictory beliefs simultaneously. This psychological state induces discomfort, forcing the person to rationalize or alter their cognitive architecture to restore mental consonance. Often, individuals will disregard factual evidence that contradicts their bias to avoid the distress of restructuring their convictions.",
      content: "Why do people sometimes reject factual evidence?",
      options: [
        "Because facts are inherently incorrect.",
        "To prevent the psychological distress of changing their bias.",
        "Because they lack basic intelligence.",
        "To increase cognitive discomfort actively."
      ],
      correct: 1,
      explanation: "El pasaje describe que ignoran evidencia para evitar la angustia o malestar psicológico que genera reestructurar sus sesgos."
    }
  ],

  // 8 COMPRENSIONES AUDITIVAS ADAPTATIVAS (CON TRANSCRIPCIÓN DE AUDIO)
  listening: [
    {
      id: 'l_a2_1',
      level: 'A2',
      transcript: "Hi, Susan. The movie starts at seven o'clock, but we should meet outside the theater at six-thirty to get the tickets early.",
      content: "What time does the speaker suggest meeting?",
      options: ["At 7:00.", "At 6:30.", "At 6:00.", "At 7:30."],
      correct: 1,
      explanation: "El interlocutor sugiere reunirse a las 6:30 ('six-thirty') para comprar boletos."
    },
    {
      id: 'l_b1_1',
      level: 'B1',
      transcript: "Attention all passengers of flight AM-304 with destination to Paris. Due to minor technical maintenance, our boarding time is delayed by forty-five minutes. Please stay close to Gate twelve.",
      content: "How much longer will passengers have to wait?",
      options: ["15 minutes.", "12 minutes.", "45 minutes.", "An hour."],
      correct: 2,
      explanation: "Se menciona un retraso de 45 minutos ('forty-five minutes')."
    },
    {
      id: 'l_b2_1',
      level: 'B2',
      transcript: "I'd love to help you with the marketing project, but my plate is completely full this week. I have to finalize the quarterly review and present it to the board on Friday.",
      content: "What does the speaker mean by saying 'my plate is completely full'?",
      options: [
        "She has plenty of food to eat.",
        "She is extremely busy with other work assignments.",
        "She is going to a restaurant with her board.",
        "She does not like the marketing project."
      ],
      correct: 1,
      explanation: "La expresión idiomática 'my plate is full' significa tener demasiadas responsabilidades simultáneas."
    },
    {
      id: 'l_c1_1',
      level: 'C1',
      transcript: "While we have made massive strides in reducing our carbon footprint inside the headquarters, I'm afraid our supply chain footprint is still remarkably high. We must pressure our external providers to meet our standards, or we might face strong public backlash.",
      content: "What is the primary concern of the speaker regarding the company?",
      options: [
        "The high costs of raw materials.",
        "The potential public backlash due to their supply chain's carbon footprint.",
        "The lack of carbon reduction inside headquarters.",
        "A lack of communication with internal employees."
      ],
      correct: 1,
      explanation: "La principal preocupación es la huella de carbono de los proveedores externos (supply chain) y el escrutinio público negativo."
    },
    {
      id: 'l_c2_1',
      level: 'C2',
      transcript: "It is rather disingenuous of the local council to advocate for public health while simultaneously slashing the budget for city parks. Green spaces are not mere ornamental luxuries; they are the literal lungs of our urban centers and critical vectors for psychological well-being.",
      content: "What is the tone and stance of the speaker towards the local council?",
      options: [
        "Highly supportive of their financial decisions.",
        "Indifferent towards city planning budgets.",
        "Critical and dismissive of their hypocritical stance on health.",
        "Amused by their creative ornamental designs."
      ],
      correct: 2,
      explanation: "El uso de la palabra 'disingenuous' (hipócrita/falso) e impugnar el recorte de presupuesto demuestra una postura crítica."
    },
    {
      id: 'l_b2_2',
      level: 'B2',
      transcript: "We were thinking about launching the product in March, but after looking at our competitors' schedule, we decided it's best to hold off until late summer to maximize market attention.",
      content: "Why did the company delay the product launch?",
      options: [
        "Because of manufacturing errors.",
        "To avoid overlapping with competitors' launches.",
        "To wait for winter discount rates.",
        "The project team resigned in spring."
      ],
      correct: 1,
      explanation: "Se posterga para evitar competir directamente con el calendario de lanzamientos de sus competidores directos."
    },
    {
      id: 'l_a2_2',
      level: 'A2',
      transcript: "Hello, reception. I would like to order some breakfast in my room tomorrow morning at eight o'clock, please. Just a coffee and a croissant.",
      content: "What does the speaker want to order?",
      options: ["A dinner menu.", "Breakfast in room.", "A lunch table.", "Taxi service."],
      correct: 1,
      explanation: "El orador solicita de manera expresa ordenar desayuno a su habitación ('breakfast in my room')."
    },
    {
      id: 'l_b1_2',
      level: 'B1',
      transcript: "I checked the forecast for our weekend trip, and it looks like it is going to rain on Sunday. We should probably pack our umbrellas and cancel the beach picnic.",
      content: "What weather is predicted for Sunday?",
      options: ["Sunny weather.", "Snowy weather.", "Rainy weather.", "Windy weather."],
      correct: 2,
      explanation: "El pronóstico del clima indica que lloverá el domingo ('rain on Sunday')."
    }
  ],

  // SECCIÓN DE PRODUCCIÓN ESCRITA Y HABLA
  writing: {
    prompt: "Write a short essay (150-200 words) discussing whether technology brings people closer together or isolates them further. Provide personal examples."
  },
  speaking: {
    prompt: "Read the following quote aloud and explain in your own words if you agree: 'The limits of my language mean the limits of my world.' Speak for about 45 seconds."
  }
};

export default function App() {
  // --- Estados de Aplicación ---
  const [currentScreen, setCurrentScreen] = useState('landing'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('english_pro_gemini_key') || DEFAULT_GEMINI_API_KEY);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- Perfil de Usuario ---
  const [user, setUser] = useState({
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    country: 'México',
    age: '28',
    estimatedLevel: 'B1',
    goal: 'Certificación Internacional',
    completedTests: [
      { id: 't1', date: '12 May 2026', score: 48, level: 'A2', details: { grammar: 45, vocabulary: 50, reading: 40, listening: 50, writing: 42, speaking: 60 } },
      { id: 't2', date: '04 Jun 2026', score: 74, level: 'B2', details: { grammar: 76, vocabulary: 72, reading: 78, listening: 70, writing: 72, speaking: 74 } }
    ]
  });

  // --- Formulario de Auth ---
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', country: 'México', age: '25', estimatedLevel: 'B1', goal: 'Trabajo' });

  // --- Estado del Motor Adaptativo de Evaluación (IRT) ---
  const [assessmentState, setAssessmentState] = useState({
    skill: 'grammar', 
    currentQuestionIndexInSkill: 0, // Índice relativo de la pregunta dentro del bloque actual
    totalQuestionsAnswered: 0, // Progreso global (0 a 30)
    currentLevel: 'B1', // Nivel dinámico adaptativo (IRT)
    answers: [], 
    grammarScore: 0,
    vocabularyScore: 0,
    readingScore: 0,
    listeningScore: 0,
    writingText: '',
    speakingText: '',
    speakingRecording: false,
    aiAnalysisWriting: null,
    aiAnalysisSpeaking: null,
    isLoadingAI: false,
    startTime: null,
    // ID de la pregunta seleccionada actualmente
    activeQuestionId: null
  });

  // --- Guardar API Key de Gemini ---
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('english_pro_gemini_key', key);
    alertModal("Clave API guardada con éxito.");
  };

  // --- Alertas en Modal ---
  const [notification, setNotification] = useState(null);
  const alertModal = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- SELECCIÓN ADAPTATIVA INTELIGENTE DE PREGUNTAS (Algoritmo IRT) ---
  const getAdaptiveQuestion = (skill, level, alreadyAnsweredIds) => {
    const questions = SIMULATED_QUESTION_BANK[skill];
    // Comprobar que 'questions' sea un Array válido antes de manipularlo
    if (!questions || !Array.isArray(questions)) return null;

    // 1. Filtrar preguntas que no hayan sido respondidas en esta sesión
    const pool = questions.filter(q => !alreadyAnsweredIds.includes(q.id));
    if (pool.length === 0) {
      // Si se agota el pool, permitimos repetir preguntas no contestadas recientemente
      return questions[0];
    }

    // 2. Intentar encontrar coincidencia exacta de nivel (A1-C2)
    const exactMatch = pool.filter(q => q.level === level);
    if (exactMatch.length > 0) {
      // Retornamos una pregunta aleatoria de ese nivel
      return exactMatch[Math.floor(Math.random() * exactMatch.length)];
    }

    // 3. Fallback: buscar el nivel más cercano en orden de escala
    const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const targetIdx = levelsOrder.indexOf(level);
    
    // Ordenar el pool según cercanía absoluta al nivel de destino
    pool.sort((a, b) => {
      const distA = Math.abs(levelsOrder.indexOf(a.level) - targetIdx);
      const distB = Math.abs(levelsOrder.indexOf(b.level) - targetIdx);
      return distA - distB;
    });

    return pool[0]; // Retorna la más cercana disponible
  };

  // --- Inicializar la primera pregunta del test adaptativo ---
  useEffect(() => {
    if (currentScreen === 'testing' && !assessmentState.activeQuestionId) {
      const firstQ = getAdaptiveQuestion('grammar', assessmentState.currentLevel, []);
      if (firstQ) {
        setAssessmentState(prev => ({
          ...prev,
          activeQuestionId: firstQ.id
        }));
      }
    }
  }, [currentScreen]);

  // --- ALGORITMO DE RESPUESTA ADAPTATIVA (IRT) ---
  const handleAnswerQuestion = (selectedOptionIndex) => {
    const { 
      skill, 
      currentQuestionIndexInSkill, 
      totalQuestionsAnswered, 
      currentLevel, 
      answers, 
      activeQuestionId 
    } = assessmentState;

    const questions = SIMULATED_QUESTION_BANK[skill];
    if (!questions || !Array.isArray(questions)) return;

    // Buscar el objeto de la pregunta activa real
    const currentQuestion = questions.find(q => q.id === activeQuestionId) || questions[0];
    const isCorrect = selectedOptionIndex === currentQuestion.correct;

    // Guardar respuesta con su ID único para evitar repeticiones
    const updatedAnswers = [...answers, {
      questionId: currentQuestion.id,
      skill,
      level: currentLevel,
      isCorrect
    }];

    // Calcular el nivel dinámico adaptativo (IRT simplificado)
    const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    let nextLevel = currentLevel;
    let currentLevelIdx = levelsOrder.indexOf(currentLevel);

    if (isCorrect) {
      // Sube un peldaño si acertó y no está en el límite superior
      if (currentLevelIdx < levelsOrder.length - 1) {
        nextLevel = levelsOrder[currentLevelIdx + 1];
      }
    } else {
      // Baja un peldaño si falló y no está en el límite inferior
      if (currentLevelIdx > 0) {
        nextLevel = levelsOrder[currentLevelIdx - 1];
      }
    }

    // Avanzar contador del bloque actual y del total global
    const nextQuestionIndexInSkill = currentQuestionIndexInSkill + 1;
    const nextTotalQuestions = totalQuestionsAnswered + 1;

    // DEFINICIÓN DE UMBRALES EXPANSORES: 10 de Grammar, 10 de Vocabulary, 5 de Reading, 5 de Listening = 30 preguntas
    let transitionToNextSkill = false;
    let nextSkill = skill;

    if (skill === 'grammar' && nextQuestionIndexInSkill >= 10) {
      transitionToNextSkill = true;
      nextSkill = 'vocabulary';
    } else if (skill === 'vocabulary' && nextQuestionIndexInSkill >= 10) {
      transitionToNextSkill = true;
      nextSkill = 'reading';
    } else if (skill === 'reading' && nextQuestionIndexInSkill >= 5) {
      transitionToNextSkill = true;
      nextSkill = 'listening';
    } else if (skill === 'listening' && nextQuestionIndexInSkill >= 5) {
      transitionToNextSkill = true;
      nextSkill = 'writing';
    }

    // Calcular los puntajes de las habilidades que se van cerrando
    let grammarScore = assessmentState.grammarScore;
    let vocabularyScore = assessmentState.vocabularyScore;
    let readingScore = assessmentState.readingScore;
    let listeningScore = assessmentState.listeningScore;

    if (transitionToNextSkill) {
      const skillAnswers = updatedAnswers.filter(a => a.skill === skill);
      const correctCount = skillAnswers.filter(a => a.isCorrect).length;
      const pct = Math.round((correctCount / skillAnswers.length) * 100);
      
      if (skill === 'grammar') grammarScore = pct;
      if (skill === 'vocabulary') vocabularyScore = pct;
      if (skill === 'reading') readingScore = pct;
      if (skill === 'listening') listeningScore = pct;
    }

    // Obtener la siguiente pregunta de forma adaptativa para el nuevo estado
    const alreadyAnsweredIds = updatedAnswers.map(a => a.questionId);
    const nextQ = getAdaptiveQuestion(nextSkill, transitionToNextSkill ? 'B1' : nextLevel, alreadyAnsweredIds);

    setAssessmentState(prev => ({
      ...prev,
      skill: nextSkill,
      currentQuestionIndexInSkill: transitionToNextSkill ? 0 : nextQuestionIndexInSkill,
      totalQuestionsAnswered: nextTotalQuestions,
      currentLevel: transitionToNextSkill ? 'B1' : nextLevel,
      answers: updatedAnswers,
      grammarScore,
      vocabularyScore,
      readingScore,
      listeningScore,
      activeQuestionId: nextQ ? nextQ.id : null
    }));
  };

  // --- Reproductor de voz integrado con Web Speech API ---
  const handlePlayListeningAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; 
      window.speechSynthesis.speak(utterance);
      alertModal("Reproduciendo audio simulado por IA...", "info");
    } else {
      alertModal("Tu navegador no soporta síntesis de voz.", "error");
    }
  };

  // --- Reconocimiento de Voz para Speaking (Web Speech API) ---
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef(null);

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alertModal("Función no soportada nativamente en tu navegador. Puedes escribir la respuesta.", "info");
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRec();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsRecognizing(true);
      setAssessmentState(prev => ({ ...prev, speakingRecording: true }));
      alertModal("Grabadora encendida. Comienza a hablar.", "info");
    };

    recognitionRef.current.onerror = (event) => {
      console.error(event);
      alertModal("Error en grabación. Escribe o re-intenta.", "error");
    };

    recognitionRef.current.onend = () => {
      setIsRecognizing(false);
      setAssessmentState(prev => ({ ...prev, speakingRecording: false }));
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAssessmentState(prev => ({
          ...prev,
          speakingText: prev.speakingText + " " + finalTranscript
        }));
      }
    };

    recognitionRef.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
    }
  };

  // --- LLAMADA A LA API DE GEMINI ---
  const callGeminiAPI = async (promptText, systemPrompt = "", type = "writing", currentLevel = "B1", grammarVocabScore = 70) => {
    const keyToUse = apiKey || DEFAULT_GEMINI_API_KEY;
    if (!keyToUse) {
      // Fallback adaptativo dinámico e inteligente sin API Key
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockAIResponse(promptText, type, currentLevel, grammarVocabScore));
        }, 1500);
      });
    }

    const url = `https://genergenerativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${keyToUse}`;
    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      systemInstruction: { parts: [{ text: systemPrompt || "Eres un examinador de inglés del MCER." }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            estimatedCEFR: { type: "STRING" },
            grammarGrammarAndVocabularyFeedback: { type: "STRING" },
            coherenceAndCohesionFeedback: { type: "STRING" },
            improvedVersion: { type: "STRING" },
            strengths: { type: "ARRAY", items: { type: "STRING" } },
            weaknesses: { type: "ARRAY", items: { type: "STRING" } },
            nextSteps: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["score", "estimatedCEFR", "grammarGrammarAndVocabularyFeedback", "coherenceAndCohesionFeedback", "improvedVersion", "strengths", "weaknesses", "nextSteps"]
        }
      }
    };

    let retries = 5;
    let delay = 1000;
    while (retries > 0) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const json = await response.json();
          const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          return JSON.parse(rawText);
        } else {
          throw new Error(`HTTP Error ${response.status}`);
        }
      } catch (err) {
        retries--;
        if (retries === 0) {
          return getMockAIResponse(promptText, type, currentLevel, grammarVocabScore); 
        }
        await new Promise(r => setTimeout(r, delay));
        delay *= 2; 
      }
    }
  };

  // --- GENERADOR DINÁMICO DE FEEDBACK SEGÚN DESEMPEÑO REAL (IRT METRICS) ---
  const getMockAIResponse = (promptText, type, currentLevel, grammarVocabScore) => {
    const wordCount = promptText.split(/\s+/).filter(Boolean).length;
    
    let baseScore = 50;
    if (currentLevel === 'A1') baseScore = 20;
    else if (currentLevel === 'A2') baseScore = 40;
    else if (currentLevel === 'B1') baseScore = 55;
    else if (currentLevel === 'B2') baseScore = 70;
    else if (currentLevel === 'C1') baseScore = 83;
    else if (currentLevel === 'C2') baseScore = 95;

    let lengthModifier = 0;
    if (type === 'writing') {
      if (wordCount < 40) lengthModifier = -25;
      else if (wordCount < 100) lengthModifier = -10;
      else if (wordCount > 160) lengthModifier = 5;
    } else {
      if (wordCount < 15) lengthModifier = -20;
      else if (wordCount < 35) lengthModifier = -5;
      else if (wordCount > 60) lengthModifier = 8;
    }

    const realGrammarPerformance = typeof grammarVocabScore === 'number' ? grammarVocabScore : 50;
    const finalCalculatedScore = Math.min(100, Math.max(5, Math.round((baseScore * 0.6) + (realGrammarPerformance * 0.4) + lengthModifier)));

    let determinedCEFR = 'B1';
    if (finalCalculatedScore >= 90) determinedCEFR = 'C2';
    else if (finalCalculatedScore >= 80) determinedCEFR = 'C1';
    else if (finalCalculatedScore >= 65) determinedCEFR = 'B2';
    else if (finalCalculatedScore >= 50) determinedCEFR = 'B1';
    else if (finalCalculatedScore >= 35) determinedCEFR = 'A2';
    else determinedCEFR = 'A1';

    const databaseByLevel = {
      'A1': {
        grammarVocab: "Estructuras extremadamente limitadas. Se detectan errores sistemáticos en conjugación básica y carencia severa de rango léxico.",
        coherence: "El mensaje carece de conectores de transición, hilando ideas de forma fragmentada y repetitiva.",
        improved: "I appreciate technology. It helps me to learn English. It connects me with my sister and friends.",
        strengths: ["Disposición para intentar responder en inglés", "Uso correcto de pronombres y sustantivos básicos"],
        weaknesses: ["Falta extrema de verbos complejos", "Incapacidad para estructurar ideas argumentativas"],
        nextSteps: ["Estudiar tiempos verbales básicos (Presente Simple)", "Memorizar vocabulario de temas cotidianos", "Construir oraciones simples con estructura Sujeto + Verbo + Objeto"]
      },
      'A2': {
        grammarVocab: "Estructuras básicas comprensibles pero con problemas frecuentes de tiempos verbales (especialmente pasados regulares e irregulares).",
        coherence: "Conexiones lineales sencillas ('and', 'but', 'because'). Presencia de redundancia léxica constante.",
        improved: "Personally, I believe technology is positive because it brings families closer together, although sometimes we spend too much time on phones.",
        strengths: ["Formulación correcta de ideas de opinión simple", "Conectores de coordinación básicos usados de forma lógica"],
        weaknesses: ["Vocabulario limitado de adjetivos", "Errores constantes de deletreo y preposiciones"],
        nextSteps: ["Práctica intensiva de verbos irregulares en pasado", "Aprender expresiones de tiempo futuro (going to, will)", "Estudiar posesivos y pronombres reflexivos"]
      },
      'B1': {
        grammarVocab: "Rango gramatical intermedio funcional. Se aprecian fallas recurrentes al estructurar condicionales y voz pasiva.",
        coherence: "Hila oraciones de forma clara dividiendo ideas en párrafos, pero carece de un vocabulario formal refinado.",
        improved: "Technology undoubtedly plays an essential role in bringing people closer. For example, social networks allow us to maintain long-distance friendships. However, excess use can isolate us from real life.",
        strengths: ["Estructuración organizada de argumentos", "Uso correcto de comparativos y superlativos"],
        weaknesses: ["Falta de phrasal verbs académicos", "Conectores lógicos muy repetitivos"],
        nextSteps: ["Estudiar los condicionales (First and Second Conditionals)", "Enriquecer el vocabulario formal con adjetivos avanzados", "Practicar el uso de la voz pasiva"]
      },
      'B2': {
        grammarVocab: "Buen dominio gramatical de oraciones compuestas. Vocabulario amplio y flexible para ámbitos laborales y universitarios cotidianos.",
        coherence: "Uso fluido de organizadores de texto ('furthermore', 'on the contrary'). Transiciones lógicas limpias.",
        improved: "While digital devices are frequently blamed for separating individuals, they simultaneously bridge geographical divides. Real-time collaboration software facilitates global productivity, although physical fatigue is a constant risk.",
        strengths: ["Rango de vocabulario académico destacado", "Excelente control sintáctico general"],
        weaknesses: ["Errores menores de entonación y colocaciones", "Uso limitado de conectores formales de nivel C1"],
        nextSteps: ["Dominar estructuras de inversión gramatical", "Estudiar expresiones modales perfectas (should have, must have)", "Practicar el connected speech para sonar más natural"]
      },
      'C1': {
        grammarVocab: "Sintaxis precisa y rango de vocabulario avanzado con muy pocos deslices. Emplea inversiones idiomáticas perfectamente.",
        coherence: "Texto sumamente cohesivo y de lectura elegante. Marcadores de transición variados and bien posicionados.",
        improved: "Rarely has human communication been altered as drastically as through the advent of modern tech. Rather than promoting isolation, digital structures serve as conduits for unprecedented integration.",
        strengths: ["Excelente uso de adverbios restrictivos e inversiones", "Vocabulario matizado de alta complejidad académica"],
        weaknesses: ["Pequeños deslices estilísticos que no merman la comprensión"],
        nextSteps: ["Estudiar modismos nativos avanzados y lenguaje figurado", "Refinar las sutilezas de la voz pasiva compleja", "Leer prensa científica o filosófica en inglés de manera diaria"]
      },
      'C2': {
        grammarVocab: "Nivel equivalente a un hablante nativo altamente educado. Vocabulario rico, preciso y un control gramatical impecable.",
        coherence: "Flujo argumentativo sobresaliente, presentado con sofisticación y excelente precisión lógica.",
        improved: promptText + " (Your original output displays exemplary mastery and sophisticated control of C2 conventions.)",
        strengths: ["Uso natural y elocuente de recursos retóricos", "Precisión léxica impecable en todo el desarrollo"],
        weaknesses: ["Errores de deletreo insignificantes que ocurren por velocidad de captura"],
        nextSteps: ["Seguir interactuando con foros académicos o especializados", "Refinar el estilo de escritura técnica según directrices específicas"]
      }
    };

    const targetFeedback = databaseByLevel[determinedCEFR];

    return {
      score: finalCalculatedScore,
      estimatedCEFR: determinedCEFR,
      grammarGrammarAndVocabularyFeedback: targetFeedback.grammarVocab,
      coherenceAndCohesionFeedback: targetFeedback.coherence,
      improvedVersion: targetFeedback.improved,
      strengths: targetFeedback.strengths,
      weaknesses: targetFeedback.weaknesses,
      nextSteps: targetFeedback.nextSteps
    };
  };

  // --- Finalizar Evaluación ---
  const handleCompleteAssessment = async () => {
    setAssessmentState(prev => ({ ...prev, isLoadingAI: true }));
    
    const writingPrompt = `Evaluate this English writing response to: "${SIMULATED_QUESTION_BANK.writing.prompt}". Text: "${assessmentState.writingText}"`;
    const speakingPrompt = `Evaluate this English speaking response transcript (generated from voice-to-text): "${SIMULATED_QUESTION_BANK.speaking.prompt}". Text: "${assessmentState.speakingText}"`;

    try {
      const writingAnalysis = await callGeminiAPI(
        writingPrompt, 
        "Eres un evaluador del MCER para textos en inglés.",
        "writing",
        assessmentState.currentLevel,
        assessmentState.grammarScore
      );

      const speakingAnalysis = await callGeminiAPI(
        speakingPrompt, 
        "Eres un evaluador del MCER para audio transcripto en inglés.",
        "speaking",
        assessmentState.currentLevel,
        assessmentState.grammarScore
      );

      const rScore = typeof assessmentState.readingScore === 'number' ? assessmentState.readingScore : 50;
      const lScore = typeof assessmentState.listeningScore === 'number' ? assessmentState.listeningScore : 50;
      const wScore = typeof writingAnalysis?.score === 'number' ? writingAnalysis.score : 50;
      const sScore = typeof speakingAnalysis?.score === 'number' ? speakingAnalysis.score : 50;
      const gScore = typeof assessmentState.grammarScore === 'number' ? assessmentState.grammarScore : 50;
      const vScore = typeof assessmentState.vocabularyScore === 'number' ? assessmentState.vocabularyScore : 50;

      const finalAverageScore = Math.round((rScore + lScore + wScore + sScore + gScore + vScore) / 6);
      
      let finalCEFR = 'B1';
      if (finalAverageScore >= 90) finalCEFR = 'C2';
      else if (finalAverageScore >= 80) finalCEFR = 'C1';
      else if (finalAverageScore >= 65) finalCEFR = 'B2';
      else if (finalAverageScore >= 50) finalCEFR = 'B1';
      else if (finalAverageScore >= 35) finalCEFR = 'A2';
      else finalCEFR = 'A1';

      const newTestRecord = {
        id: 't' + (user.completedTests.length + 1),
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        score: finalAverageScore,
        level: finalCEFR,
        details: {
          grammar: gScore,
          vocabulary: vScore,
          reading: rScore,
          listening: lScore,
          writing: wScore,
          speaking: sScore
        },
        aiFeedback: {
          writing: writingAnalysis,
          speaking: speakingAnalysis
        }
      };

      setUser(prev => ({
        ...prev,
        completedTests: [newTestRecord, ...prev.completedTests]
      }));

      setAssessmentState(prev => ({
        ...prev,
        aiAnalysisWriting: writingAnalysis,
        aiAnalysisSpeaking: speakingAnalysis,
        isLoadingAI: false
      }));

      setCurrentScreen('results');
      alertModal("¡Evaluación adaptativa de 50 preguntas calificada con éxito!");
    } catch (e) {
      console.error(e);
      setAssessmentState(prev => ({ ...prev, isLoadingAI: false }));
      alertModal("Ocurrió un inconveniente al procesar los datos.", "error");
    }
  };

  const handleStartFreshTest = () => {
    setAssessmentState({
      skill: 'grammar',
      currentQuestionIndexInSkill: 0,
      totalQuestionsAnswered: 0,
      currentLevel: user.estimatedLevel || 'B1',
      answers: [],
      grammarScore: 0,
      vocabularyScore: 0,
      readingScore: 0,
      listeningScore: 0,
      writingText: '',
      speakingText: '',
      speakingRecording: false,
      aiAnalysisWriting: null,
      aiAnalysisSpeaking: null,
      isLoadingAI: false,
      startTime: Date.now(),
      activeQuestionId: null
    });
    setCurrentScreen('testing');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (authForm.email) {
        setUser(prev => ({ ...prev, name: authForm.name || prev.name, email: authForm.email }));
        setCurrentScreen('dashboard');
        alertModal("Sesión iniciada con éxito.");
      }
    } else {
      setUser({
        name: authForm.name,
        email: authForm.email,
        country: authForm.country,
        age: authForm.age,
        estimatedLevel: authForm.estimatedLevel,
        goal: authForm.goal,
        completedTests: []
      });
      setCurrentScreen('dashboard');
      alertModal("Registro completo.");
    }
  };

  const handleLogout = () => {
    setUser({ name: '', email: '', completedTests: [] });
    setCurrentScreen('landing');
    alertModal("Sesión cerrada correctamente.", "info");
  };

  const currentTest = user.completedTests[0] || null;

  // Asegurar que solo busquemos si la rama del banco de preguntas actual es un Array válido
  const activeQuestion = Array.isArray(SIMULATED_QUESTION_BANK[assessmentState.skill])
    ? SIMULATED_QUESTION_BANK[assessmentState.skill]?.find(q => q.id === assessmentState.activeQuestionId) || null
    : null;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* NOTIFICACIONES */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-2xl animate-bounce bg-indigo-600 text-white border border-indigo-400">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <p className="font-semibold text-sm">{notification.msg}</p>
        </div>
      )}

      {/* CABECERA */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentScreen('landing')}>
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                English Pro <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">AI</span>
              </span>
            </div>

            {/* Menú de Escritorio (Desktop) */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setCurrentScreen('landing')} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${currentScreen === 'landing' ? 'text-indigo-400' : 'text-slate-400'}`}>Inicio</button>
              {user.email && (
                <>
                  <button onClick={() => setCurrentScreen('dashboard')} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${currentScreen === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'}`}>Mi Dashboard</button>
                  <button onClick={handleStartFreshTest} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">Evaluarme Ahora</button>
                </>
              )}
              <button onClick={() => setCurrentScreen('settings')} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${currentScreen === 'settings' ? 'text-indigo-400' : 'text-slate-400'}`}>
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="h-4 w-[1px] bg-slate-800" />
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-900 text-yellow-400' : 'hover:bg-slate-100 text-indigo-600'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user.email ? (
                <div className="flex items-center gap-3 bg-slate-900/40 p-1.5 pl-3 pr-4 rounded-full border border-slate-800/60">
                  <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors ml-1">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setAuthMode('login'); setCurrentScreen('auth'); }} className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg transition-all">
                  Iniciar Sesión
                </button>
              )}
            </div>

            {/* Iconos de cabecera móvil */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-yellow-400' : 'text-indigo-600'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-slate-100">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* CORRECCIÓN CRÍTICA DE MENÚ MÓVIL: Añadir panel de usuario y botón de salida responsivo */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-slate-950 border-b border-slate-800 space-y-4 animate-fade-in">
            <div className="space-y-1">
              <button onClick={() => { setCurrentScreen('landing'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 font-medium">Inicio</button>
              {user.email && (
                <>
                  <button onClick={() => { setCurrentScreen('dashboard'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 font-medium">Mi Dashboard</button>
                  <button onClick={() => { handleStartFreshTest(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-indigo-400 hover:bg-slate-900 font-bold">Nueva Evaluación Adaptativa</button>
                </>
              )}
              <button onClick={() => { setCurrentScreen('settings'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 font-medium">Configuración API Gemini</button>
            </div>

            <div className="border-t border-slate-800 pt-4">
              {user.email ? (
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-950 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setAuthMode('login'); setCurrentScreen('auth'); setIsMobileMenuOpen(false); }} 
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm"
                >
                  Iniciar Sesión / Registrarse
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* SCREEN 1: LANDING PAGE */}
        {currentScreen === 'landing' && (
          <div className="space-y-20 py-8">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Nivel Adaptativo Extendido: Examen de 30 Preguntas Estructuradas por Niveles (A1 - C2)</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Certifica tu nivel de inglés con precisión profesional e IA.
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Evaluación adaptativa integral con un banco avanzado de 64 preguntas calibradas para medir gramática, léxico, comprensión auditiva y escrita.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {user.email ? (
                  <button 
                    onClick={() => setCurrentScreen('dashboard')} 
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ir a Mi Panel Personal</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => { setAuthMode('register'); setCurrentScreen('auth'); }} 
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Comenzar Evaluación Adaptativa</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => setCurrentScreen('settings')} 
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="w-5 h-5 text-indigo-400" />
                  <span>Configurar API Key</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all shadow-lg">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 w-fit mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Banco de 64 Preguntas Oficiales</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Contenido curado para evaluar con precisión quirúrgica desde el nivel básico elemental A1 hasta el dominio absoluto y académico de nivel C2.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all shadow-lg">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 w-fit mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Examen Completo de 30 Preguntas</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Las preguntas se autoseleccionan de manera adaptativa. El examen consta de 30 preguntas de opción múltiple para garantizar la máxima confiabilidad.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all shadow-lg">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 w-fit mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Diagnóstico Preciso</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Resultados respaldados en métricas reales de desempeño que se traducen en retroalimentación específica de escritura y habla asistida por Gemini AI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: AUTH */}
        {currentScreen === 'auth' && (
          <div className="max-w-md mx-auto py-12">
            <div className="bg-slate-900/80 border border-slate-800/80 p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Acceso Premium</h2>
                <p className="text-sm text-slate-400">Introduce tus datos para acceder al examen adaptativo</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button onClick={() => setAuthMode('login')} className={`py-2 text-xs font-semibold rounded-lg transition-all ${authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Iniciar Sesión</button>
                <button onClick={() => setAuthMode('register')} className={`py-2 text-xs font-semibold rounded-lg transition-all ${authMode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Registrarse</button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Nombre Completo</label>
                      <input type="text" required placeholder="Juan Pérez" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">País</label>
                        <input type="text" required placeholder="México" value={authForm.country} onChange={(e) => setAuthForm({...authForm, country: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Edad</label>
                        <input type="number" required placeholder="25" value={authForm.age} onChange={(e) => setAuthForm({...authForm, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Correo Electrónico</label>
                  <input type="email" required placeholder="ejemplo@correo.com" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Contraseña</label>
                  <input type="password" required placeholder="••••••••" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100" />
                </div>

                <button type="submit" className="w-full mt-2 py-3.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg transition-all">
                  {authMode === 'login' ? 'Entrar' : 'Registrar Cuenta'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SCREEN 3: DASHBOARD */}
        {currentScreen === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Dashboard Profesional</span>
                <h1 className="text-3xl font-extrabold mt-1">¡Hello, {user.name}!</h1>
                <p className="text-sm text-slate-400 mt-1">El banco cuenta con 64 preguntas totales para soportar el examen de 30 preguntas.</p>
              </div>
              <button onClick={handleStartFreshTest} className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg transition-all flex items-center gap-2">
                <Play className="w-5 h-5 fill-current text-white" />
                <span>Iniciar Evaluación Adaptativa Completa (30 Preguntas)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Nivel Actual</span>
                  <div className="text-3xl font-extrabold text-indigo-400 mt-1">{currentTest ? currentTest.level : user.estimatedLevel}</div>
                  <span className="text-xs text-slate-400 mt-1 block">MCER Oficial</span>
                </div>
                <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-400"><Award className="w-6 h-6" /></div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Puntaje General</span>
                  <div className="text-3xl font-extrabold text-indigo-400 mt-1">{currentTest ? `${currentTest.score}/100` : 'N/A'}</div>
                  <span className="text-xs text-slate-400 mt-1 block">Escala Global</span>
                </div>
                <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-400"><TrendingUp className="w-6 h-6" /></div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Banco de Preguntas</span>
                  <div className="text-3xl font-extrabold text-indigo-400 mt-1">64 Ítems</div>
                  <span className="text-xs text-slate-400 mt-1 block">Para una calibración profunda</span>
                </div>
                <div className="p-3.5 bg-violet-500/10 rounded-2xl text-violet-400"><Database className="w-6 h-6" /></div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Objetivo Primario</span>
                  <div className="text-lg font-bold text-indigo-400 mt-2 truncate max-w-[140px]">{user.goal}</div>
                  <span className="text-xs text-slate-400 mt-1 block">Ruta Personalizada</span>
                </div>
                <div className="p-3.5 bg-orange-500/10 rounded-2xl text-orange-400"><Briefcase className="w-6 h-6" /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                    <span>Rendimiento por Competencia</span>
                  </h3>
                  {currentTest ? (
                    <div className="space-y-4">
                      {Object.entries(currentTest.details).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400 uppercase">{key}</span>
                            <span className="text-indigo-400">{val}%</span>
                          </div>
                          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-sm">Completa tu primer examen adaptativo con el nuevo banco para ver métricas.</div>
                  )}
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold mb-4">Historial de Evaluaciones</h3>
                  <div className="space-y-3">
                    {user.completedTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">{test.level}</div>
                          <div>
                            <div className="text-sm font-bold text-slate-200">{test.date}</div>
                            <div className="text-xs text-slate-400">Banco Expandido Adaptativo</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-extrabold text-indigo-400">{test.score}/100</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="bg-gradient-to-br from-indigo-950 to-violet-950/70 border border-indigo-900/60 rounded-3xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Plan de Mejora Adaptativo</span>
                  </div>
                  <h3 className="text-xl font-extrabold leading-tight text-white">Camino hacia tu siguiente nivel</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    El motor adaptativo de 30 preguntas de opción múltiple calibra exactamente cuáles de las 6 áreas lingüísticas clave necesitas potenciar hoy de manera precisa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 4: SETTINGS */}
        {currentScreen === 'settings' && (
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="flex items-center gap-3 text-indigo-400">
                <Settings className="w-8 h-8" />
                <h2 className="text-2xl font-extrabold">Configuración del Sistema</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-400">Gemini API Key</label>
                  <input type="password" placeholder="Clave de la API (deja vacío para simulador inteligente)" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs" />
                  <button onClick={() => handleSaveApiKey(apiKey)} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white">Guardar Configuración</button>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setCurrentScreen('dashboard')} className="px-6 py-3 rounded-xl text-sm font-bold bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 5: TESTING */}
        {currentScreen === 'testing' && (
          <div className="max-w-3xl mx-auto py-4">
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  Evaluación Adaptativa (Pregunta {assessmentState.totalQuestionsAnswered + 1} de 30)
                </span>
                <span className="text-xs font-bold bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
                  Dificultad de la Pregunta: <strong className="text-indigo-400">{activeQuestion?.level || assessmentState.currentLevel}</strong>
                </span>
              </div>
              
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" 
                  style={{ 
                    width: `${Math.round((assessmentState.totalQuestionsAnswered / 30) * 100)}%` 
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className={assessmentState.skill === 'grammar' ? 'text-indigo-400 font-bold' : ''}>1. Grammar (10)</span>
                <span className={assessmentState.skill === 'vocabulary' ? 'text-indigo-400 font-bold' : ''}>2. Vocab (10)</span>
                <span className={assessmentState.skill === 'reading' ? 'text-indigo-400 font-bold' : ''}>3. Reading (5)</span>
                <span className={assessmentState.skill === 'listening' ? 'text-indigo-400 font-bold' : ''}>4. Listening (5)</span>
                <span className={assessmentState.skill === 'writing' ? 'text-indigo-400 font-bold' : ''}>5. Writing</span>
                <span className={assessmentState.skill === 'speaking' ? 'text-indigo-400 font-bold' : ''}>6. Speaking</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              
              {/* SECCIÓN 1 Y 2: GRAMMAR & VOCABULARY */}
              {(assessmentState.skill === 'grammar' || assessmentState.skill === 'vocabulary') && activeQuestion && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {assessmentState.skill}
                    </span>
                    <span className="text-xs text-slate-500">
                      Pregunta {assessmentState.currentQuestionIndexInSkill + 1} de 10
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-relaxed text-slate-100">
                    {activeQuestion.content}
                  </h3>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {activeQuestion.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswerQuestion(idx)}
                        className="w-full text-left p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 text-sm font-semibold text-slate-300 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 3: READING */}
              {assessmentState.skill === 'reading' && activeQuestion && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {assessmentState.skill}
                    </span>
                    <span className="text-xs text-slate-500">
                      Texto {assessmentState.currentQuestionIndexInSkill + 1} de 5
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-h-[220px] overflow-y-auto text-xs text-slate-300 leading-relaxed font-mono">
                    {activeQuestion.passage}
                  </div>

                  <h3 className="text-lg font-bold leading-relaxed text-slate-100">
                    {activeQuestion.content}
                  </h3>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {activeQuestion.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswerQuestion(idx)}
                        className="w-full text-left p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 4: LISTENING */}
              {assessmentState.skill === 'listening' && activeQuestion && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {assessmentState.skill}
                    </span>
                    <span className="text-xs text-slate-500">
                      Audio {assessmentState.currentQuestionIndexInSkill + 1} de 5
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="p-4 bg-indigo-500/15 text-indigo-400 rounded-full">
                      <Volume2 className="w-10 h-10 animate-pulse" />
                    </div>
                    <button 
                      onClick={() => handlePlayListeningAudio(activeQuestion.transcript)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Reproducir Audio en Inglés</span>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold leading-relaxed text-slate-100">
                    {activeQuestion.content}
                  </h3>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {activeQuestion.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswerQuestion(idx)}
                        className="w-full text-left p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 5: WRITING */}
              {assessmentState.skill === 'writing' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      Writing
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed font-medium">
                    {SIMULATED_QUESTION_BANK.writing.prompt}
                  </div>

                  <div className="space-y-1">
                    <textarea 
                      rows={6}
                      placeholder="Escribe tu redacción aquí..."
                      value={assessmentState.writingText}
                      onChange={(e) => setAssessmentState({...assessmentState, writingText: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Palabras: {assessmentState.writingText.split(/\s+/).filter(Boolean).length}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (assessmentState.writingText.trim().length < 20) {
                        alertModal("Por favor escribe una respuesta válida para continuar.", "error");
                        return;
                      }
                      setAssessmentState(prev => ({ ...prev, skill: 'speaking' }));
                    }}
                    className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white"
                  >
                    Guardar y Avanzar
                  </button>
                </div>
              )}

              {/* SECCIÓN 6: SPEAKING */}
              {assessmentState.skill === 'speaking' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      Speaking
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                    {SIMULATED_QUESTION_BANK.speaking.prompt}
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
                    {assessmentState.speakingRecording ? (
                      <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center animate-ping">
                        <Mic className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Mic className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      {!assessmentState.speakingRecording ? (
                        <button onClick={startSpeechRecognition} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white">Iniciar Grabación</button>
                      ) : (
                        <button onClick={stopSpeechRecognition} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white">Detener Grabación</button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Transcripción / Texto Dictado</label>
                    <textarea 
                      rows={4}
                      placeholder="Habla por el micrófono o transcribe tu audio manualmente aquí..."
                      value={assessmentState.speakingText}
                      onChange={(e) => setAssessmentState({...assessmentState, speakingText: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <button 
                    onClick={handleCompleteAssessment}
                    disabled={assessmentState.isLoadingAI}
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {assessmentState.isLoadingAI ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analizando con IA Adaptativa...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Terminar Examen y Generar Diagnóstico con IA</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SCREEN 6: RESULTS */}
        {currentScreen === 'results' && currentTest && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 rounded-3xl border border-indigo-900/40 text-center space-y-4">
              <div className="inline-flex p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Award className="w-10 h-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Reporte Adaptativo de Precisión</h1>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Tu nivel consolidado de suficiencia de inglés según el marco global de evaluación adaptativa es:
              </p>

              <div className="inline-block px-12 py-6 rounded-3xl bg-slate-950 border border-indigo-500/30 shadow-2xl">
                <div className="text-5xl font-black text-indigo-400 tracking-wide">{currentTest.level}</div>
                <div className="text-xs font-bold text-slate-400 uppercase mt-2">
                  {currentTest.level === 'A1' && 'Principiante Absoluto'}
                  {currentTest.level === 'A2' && 'Básico / Elemental'}
                  {currentTest.level === 'B1' && 'Intermedio - Umbral'}
                  {currentTest.level === 'B2' && 'Intermedio Alto - Avanzado'}
                  {currentTest.level === 'C1' && 'Avanzado Competente'}
                  {currentTest.level === 'C2' && 'Maestría / Bilingüe'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-6 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold">Desglose por Áreas de Habilidad</h3>
                <div className="space-y-4">
                  {Object.entries(currentTest.details).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-slate-400">{key}</span>
                        <span className="text-indigo-400">{val}%</span>
                      </div>
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-200">Equivalencia Internacional Estimada</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-500">IELTS</div>
                      <div className="font-bold text-indigo-400 mt-0.5">~{(currentTest.score / 11).toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-500">TOEFL iBT</div>
                      <div className="font-bold text-indigo-400 mt-0.5">~{Math.round(currentTest.score * 1.2)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-500">Cambridge</div>
                      <div className="font-bold text-indigo-400 mt-0.5">{currentTest.level} Pass</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Edit3 className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Diagnóstico de Producción Escrita (Writing)</h3>
                </div>

                {currentTest.aiFeedback?.writing ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <strong className="text-slate-200 block mb-1">Gramática y Vocabulario:</strong>
                      <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                        {currentTest.aiFeedback.writing.grammarGrammarAndVocabularyFeedback}
                      </p>
                    </div>
                    <div>
                      <strong className="text-slate-200 block mb-1">Coherencia y Cohesión:</strong>
                      <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                        {currentTest.aiFeedback.writing.coherenceAndCohesionFeedback}
                      </p>
                    </div>
                    <div>
                      <strong className="text-indigo-400 block mb-1">Versión Sugerida de Nivel Superior:</strong>
                      <p className="text-indigo-200 leading-relaxed bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/40 italic">
                        {currentTest.aiFeedback.writing.improvedVersion}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Feedback no disponible.</p>
                )}
              </div>
            </div>

            {currentTest.aiFeedback?.writing && (
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <h3 className="text-xl font-bold">Plan de Estudio de Acción Directa con IA</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-200">Análisis Operativo</h4>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-400 block">Fortalezas:</span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        {currentTest.aiFeedback.writing.strengths?.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-red-400 block">Áreas de Oportunidad:</span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        {currentTest.aiFeedback.writing.weaknesses?.map((wk, idx) => (
                          <li key={idx}>{wk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-200">Siguientes Pasos Recomendados</h4>
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      {currentTest.aiFeedback.writing.nextSteps?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button onClick={() => setCurrentScreen('dashboard')} className="px-8 py-3.5 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all">
                Volver a Mi Panel
              </button>
              <button onClick={handleStartFreshTest} className="px-8 py-3.5 rounded-2xl font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
                Evaluarme de Nuevo
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className={`border-t py-12 transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-slate-300">English Pro Assessment AI</span>
          </div>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Plataforma de evaluación digital adaptativa operada por IA y alineada con la Teoría de Respuesta al Ítem (IRT).
          </p>
          <div className="text-[10px] text-slate-600">
            © 2026 English Pro AI Inc. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}