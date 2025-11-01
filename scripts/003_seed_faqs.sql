-- Seed FAQs with common university questions
INSERT INTO public.faqs (question, answer, category, keywords) VALUES
(
  '¿Cuáles son los horarios de atención de la universidad?',
  'La Universidad de Medellín atiende de lunes a viernes de 7:00 AM a 9:00 PM y los sábados de 8:00 AM a 1:00 PM. Las oficinas administrativas están disponibles de lunes a viernes de 8:00 AM a 5:00 PM.',
  'Información General',
  ARRAY['horarios', 'atención', 'horario']
),
(
  '¿Cómo puedo inscribirme a un programa académico?',
  'Para inscribirte, visita nuestra página web en la sección de Admisiones, completa el formulario de inscripción en línea, adjunta los documentos requeridos y realiza el pago de la inscripción. Luego deberás presentar el examen de admisión.',
  'Admisiones',
  ARRAY['inscripción', 'admisión', 'inscribirse', 'programa']
),
(
  '¿Cuáles son las facultades disponibles?',
  'La Universidad de Medellín cuenta con: Facultad de Artes y Humanidades, Facultad de Ciencias Económicas y Administrativas, Facultad de Ciencias Básicas y Ambientales, Facultad de Derecho, Facultad de Ingenierías y Programas de Posgrado.',
  'Programas Académicos',
  ARRAY['facultades', 'programas', 'carreras']
),
(
  '¿Cómo accedo a la plataforma virtual?',
  'Puedes acceder a la plataforma virtual ingresando a campus.udemedellin.edu.co con tu usuario (correo institucional) y contraseña. Si olvidaste tu contraseña, usa la opción de recuperación.',
  'Plataforma Virtual',
  ARRAY['plataforma', 'virtual', 'campus', 'acceso']
),
(
  '¿Dónde puedo consultar mis calificaciones?',
  'Las calificaciones están disponibles en la plataforma virtual en la sección "Mis Calificaciones". También puedes consultarlas en el portal estudiantil ingresando con tus credenciales.',
  'Académico',
  ARRAY['calificaciones', 'notas', 'consultar']
),
(
  '¿Cómo solicito un certificado de estudios?',
  'Los certificados se solicitan en la Oficina de Registro y Control Académico. Puedes hacer la solicitud en línea a través del portal estudiantil o presencialmente. El tiempo de entrega es de 3 a 5 días hábiles.',
  'Trámites',
  ARRAY['certificado', 'estudios', 'solicitar', 'trámite']
),
(
  '¿Qué opciones de financiación existen?',
  'La universidad ofrece convenios con ICETEX, créditos directos con la institución, descuentos por pronto pago, becas por mérito académico y convenios empresariales. Visita la Oficina de Bienestar Universitario para más información.',
  'Financiación',
  ARRAY['financiación', 'becas', 'crédito', 'pago']
),
(
  '¿Cómo puedo contactar a un profesor?',
  'Puedes contactar a tus profesores a través del correo institucional que aparece en la plataforma virtual, durante sus horarios de atención presencial o mediante los foros de la plataforma.',
  'Académico',
  ARRAY['profesor', 'contactar', 'docente']
),
(
  '¿Dónde está ubicada la biblioteca?',
  'La Biblioteca Central está ubicada en el Bloque 18 del campus principal. El horario es de lunes a viernes de 7:00 AM a 9:00 PM y sábados de 8:00 AM a 1:00 PM.',
  'Servicios',
  ARRAY['biblioteca', 'ubicación', 'horario']
),
(
  '¿Cómo cancelo una materia?',
  'Para cancelar una materia debes presentar la solicitud en la Oficina de Registro y Control Académico antes de la fecha límite establecida en el calendario académico. Verifica las políticas de reembolso.',
  'Académico',
  ARRAY['cancelar', 'materia', 'retiro']
)
ON CONFLICT DO NOTHING;
