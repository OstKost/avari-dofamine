package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/ostkost/dofamine/api/internal/modules/catalog/domain"
	"github.com/ostkost/dofamine/api/internal/modules/catalog/port"
	"github.com/shopspring/decimal"
)

type superCategoryTemplate struct {
	Name          string
	Icon          string
	Subcategories []subcategoryTemplate
}

type subcategoryTemplate struct {
	Name        string
	Slug        string
	Description string
	Products    []productTemplate
}

type productTemplate struct {
	Name        string
	Description string
	PriceRUB    int64
	ImageSeed   string
}

func seedCatalog(ctx context.Context, repo port.CatalogRepository) error {
	superCategories := []superCategoryTemplate{
		// 1. 🎪 Допаминовая лавка (Мелочи) — 100 – 1 500 ₽
		{
			Name: "Допаминовая лавка (Мелочи)",
			Icon: "🎪",
			Subcategories: []subcategoryTemplate{
				{
					Name:        "Антистрессы и спиннеры",
					Slug:        "dofamine-antistress",
					Description: "Спиннеры, кликеры, кубики и гаджеты для снятия напряжения на работе",
					Products: []productTemplate{
						{
							Name:        "Бесконечная пузырчатая пленка Turbo 3000",
							Description: "Электронный эмулятор лопанья пузырьков с тактильной отдачей и звуком 8K 'чпок'.",
							PriceRUB:    350,
							ImageSeed:   "dofamine-bubble-wrap",
						},
						{
							Name:        "Спиннер с гироскопом и RGB-подсветкой",
							Description: "Крутится дольше, чем длится рабочий день в пятницу. В темноте рисует график падения биткоина.",
							PriceRUB:    590,
							ImageSeed:   "dofamine-spinner-rgb",
						},
						{
							Name:        "Магнитный кубик Fidget Cube Pro",
							Description: "6 граней непрерывного щелкания, кручения и переключения. Легальный успокоитель на стендапах.",
							PriceRUB:    490,
							ImageSeed:   "dofamine-fidget-cube",
						},
						{
							Name:        "Титановый левитирующий волчок Inception",
							Description: "Вращается на магнитной подушке до 45 минут. Позволяет проверить, не спите ли вы на совещании.",
							PriceRUB:    1290,
							ImageSeed:   "dofamine-levitating-top",
						},
						{
							Name:        "Сквиш Капибара Дзен-Мастер",
							Description: "Сверхмягкая капибара в позе лотоса. При сжатии испускает легкий аромат ромашкового чая.",
							PriceRUB:    420,
							ImageSeed:   "dofamine-squish-capybara",
						},
						{
							Name:        "Антистресс-эспандер «Гнев Тимлида»",
							Description: "Усиленная жесткость 50 кг. Выдерживает любые эмоции после код-ревью джуниора.",
							PriceRUB:    650,
							ImageSeed:   "dofamine-gripper-lead",
						},
						{
							Name:        "Тактильный слайм с ароматом свежего эспрессо",
							Description: "Жидкое спокойствие кофейного цвета. Не липнет к рукам и клавиатуре.",
							PriceRUB:    290,
							ImageSeed:   "dofamine-slime-espresso",
						},
						{
							Name:        "Магнитные шарики Neocube Matte Black",
							Description: "216 магнитных сфер для сборки геометрических фигур и медитативного перебирания в руках.",
							PriceRUB:    890,
							ImageSeed:   "dofamine-neocube-black",
						},
						{
							Name:        "Карманный кликер с переключателями Cherry MX Blue",
							Description: "4 механические клавиши с сочнейшим тактильным кликом для любителей щелкать ручкой.",
							PriceRUB:    450,
							ImageSeed:   "dofamine-key-clicker",
						},
						{
							Name:        "Головоломка «Танталовы муки» из титана",
							Description: "Деревянно-титановый узел, который невозможно распутать без 100 грамм чая и дзена.",
							PriceRUB:    790,
							ImageSeed:   "dofamine-puzzle-titan",
						},
					},
				},
				{
					Name:        "Пузырчатая пленка и залипалки",
					Slug:        "dofamine-sensory",
					Description: "Сенсорные игрушки, кинетический песок и оптические гипнотизеры",
					Products: []productTemplate{
						{
							Name:        "Жидкие песочные часы с неоновыми каплями",
							Description: "Двухцветные капли масла гравитационно перетекают сверху вниз, гипнотизируя мозг.",
							PriceRUB:    490,
							ImageSeed:   "dofamine-liquid-timer",
						},
						{
							Name:        "Кинетический песок «Лунная пыль» 1 кг",
							Description: "Никогда не высыхает, держит форму замков и тает в руках, снимая тревожность.",
							PriceRUB:    690,
							ImageSeed:   "dofamine-kinetic-sand",
						},
						{
							Name:        "Левитирующий маятник Ньютона LED",
							Description: "Светящиеся стеклянные шары демонстрируют сохранение импульса в полной темноте.",
							PriceRUB:    1490,
							ImageSeed:   "dofamine-newton-cradle",
						},
						{
							Name:        "Калейдоскоп «Психоделический кот»",
							Description: "Оптический прибор с зеркальной призмой, превращающий рабочий стол в фрактальный космос.",
							PriceRUB:    390,
							ImageSeed:   "dofamine-kaleidoscope-cat",
						},
						{
							Name:        "Силиконовый коврик Pop-It Макси 30x30 см",
							Description: "100 ячеек бесконечного лопанья для снятия стресса всей командой.",
							PriceRUB:    550,
							ImageSeed:   "dofamine-popit-maxi",
						},
						{
							Name:        "Магнитная ферромагнитная жидкость в колбе",
							Description: "Черная нано-жидкость танцует и ощетинивается иглами под действием неодимового магнита.",
							PriceRUB:    1190,
							ImageSeed:   "dofamine-ferrofluid",
						},
						{
							Name:        "Сенсорная лампа «Лава-Глобус» с блестками",
							Description: "Теплый мягкий свет и медленно плавающий воск создают атмосферу ночного релакса.",
							PriceRUB:    1350,
							ImageSeed:   "dofamine-lava-lamp",
						},
						{
							Name:        "Настольный японский садик Дзен с белым песком",
							Description: "Мини-грабли, камни и бамбуковый заборчик для создания идеального порядка.",
							PriceRUB:    990,
							ImageSeed:   "dofamine-zen-garden",
						},
						{
							Name:        "Тактильные металлические кольца Акупунктура (5 шт)",
							Description: "Массажные пружинные кольца для пальцев, разгоняющие кровь после 8 часов кодинга.",
							PriceRUB:    190,
							ImageSeed:   "dofamine-massage-rings",
						},
						{
							Name:        "Флипбук-мультфильм «Побег из офиса»",
							Description: "120 страниц быстрой аналоговой анимации про счастливого человечка.",
							PriceRUB:    320,
							ImageSeed:   "dofamine-flipbook-escape",
						},
					},
				},
				{
					Name:        "Мемные штуки и офисный троллинг",
					Slug:        "dofamine-memes",
					Description: "Предметы с повышенной концентрацией юмора для опенспейса",
					Products: []productTemplate{
						{
							Name:        "Антистресс-подушка «Гигантский Enter» USB",
							Description: "Реально подключается по USB и отправляет код или сообщение при ударе кулаком.",
							PriceRUB:    1100,
							ImageSeed:   "dofamine-giant-enter",
						},
						{
							Name:        "Кнопка «Сделать всё красиво» со звуком фанфар",
							Description: "Красная кнопка на стол. Нажимаешь — гремят овации и женский голос кричит 'Гениально!'.",
							PriceRUB:    750,
							ImageSeed:   "dofamine-button-beauty",
						},
						{
							Name:        "Мотивационная карточка с цитатами Джейсона Стетхема",
							Description: "Голографическая открытка: 'Работа не волк, работа — это ворк, а волк — это ходить'.",
							PriceRUB:    150,
							ImageSeed:   "dofamine-statham-card",
						},
						{
							Name:        "Табличка на дверь «Осторожно, работает сеньор»",
							Description: "Металлическая табличка с предупреждением о повышенной опасности глупых вопросов.",
							PriceRUB:    290,
							ImageSeed:   "dofamine-senior-sign",
						},
						{
							Name:        "Печать с надписью «ОДОБРЕНО КОТОМ»",
							Description: "Автоматическая штемпельная краска для заверения архитектурных решений и счетов.",
							PriceRUB:    450,
							ImageSeed:   "dofamine-cat-stamp",
						},
						{
							Name:        "Очки с пикселями Thug Life 8-bit",
							Description: "Надеваешь при успешном закрытии критического баг-репорта на глазах у заказчика.",
							PriceRUB:    390,
							ImageSeed:   "dofamine-thug-glasses",
						},
						{
							Name:        "Тамагочи с искусственной депрессией",
							Description: "Виртуальный питомец, которого нужно вовремя поить кофе и хвалить за коммиты.",
							PriceRUB:    890,
							ImageSeed:   "dofamine-depressed-tamagotchi",
						},
						{
							Name:        "Ждун плюшевый в натуральную величину (мини)",
							Description: "Идеальный собеседник для метода утёнка и ожидания окончания деплоя.",
							PriceRUB:    850,
							ImageSeed:   "dofamine-plush-zhdun",
						},
						{
							Name:        "Детектор сарказма со звуковой сиреной",
							Description: "Пищит каждый раз, когда менеджер говорит: 'Тут задача ровно на 5 минут'.",
							PriceRUB:    1250,
							ImageSeed:   "dofamine-sarcasm-detector",
						},
						{
							Name:        "Светящаяся утка в шлеме с пропеллером",
							Description: "Устанавливается на монитор или самокат, пропеллер бешено крутится от ветра.",
							PriceRUB:    350,
							ImageSeed:   "dofamine-duck-helmet",
						},
					},
				},
				{
					Name:        "Бесполезные гениальные изобретения",
					Slug:        "dofamine-gadgets",
					Description: "Решения для несуществующих проблем, которые хочется купить прямо сейчас",
					Products: []productTemplate{
						{
							Name:        "Держатель для одного чипса из титана",
							Description: "Эргономичный пинцет для чипсов, чтобы пальцы оставались идеально чистыми.",
							PriceRUB:    490,
							ImageSeed:   "dofamine-chip-holder",
						},
						{
							Name:        "Ложка с климат-контролем и термометром",
							Description: "Цветная индикация показывает, когда суп остыл ровно до идеальных 55°C.",
							PriceRUB:    650,
							ImageSeed:   "dofamine-climate-spoon",
						},
						{
							Name:        "Зонт для чашки капучино на присоске",
							Description: "Миниатюрный купол от дождя, сохраняющий шелковистую молочную пенку на ходу.",
							PriceRUB:    390,
							ImageSeed:   "dofamine-cup-umbrella",
						},
						{
							Name:        "Мини-пылесос для клавиатуры в виде свинки",
							Description: "USB-пылесос со щелевой насадкой достает крошки из-под клавиш Space и Shift.",
							PriceRUB:    890,
							ImageSeed:   "dofamine-keyboard-vacuum",
						},
						{
							Name:        "Шумоподавляющие носки для походов к холодильнику",
							Description: "Бесшумная подошва из вспененного микроволокна. Ни одна половица не скрипнет.",
							PriceRUB:    590,
							ImageSeed:   "dofamine-stealth-socks",
						},
						{
							Name:        "Автопереворачиватель подушки на холодную сторону",
							Description: "Двусторонний гироскопический механизм для непрерывной свежести сна.",
							PriceRUB:    1490,
							ImageSeed:   "dofamine-pillow-flipper",
						},
						{
							Name:        "Компас, указывающий на ближайший диван",
							Description: "Магнитная стрелка откалибрована на поиск зоны максимального уюта и комфорта.",
							PriceRUB:    520,
							ImageSeed:   "dofamine-couch-compass",
						},
						{
							Name:        "Сканер ауры микроволновки",
							Description: "LED-индикатор настроения разогреваемой шаурмы: от 'ледяная внутри' до 'лава'.",
							PriceRUB:    780,
							ImageSeed:   "dofamine-aura-scanner",
						},
						{
							Name:        "USB-вентилятор для остывания чая",
							Description: "Направленный регулируемый поток воздуха, экономящий до 7 минут ожидания.",
							PriceRUB:    620,
							ImageSeed:   "dofamine-tea-cooler",
						},
						{
							Name:        "Антигравитационная ручка космонавта",
							Description: "Пишет вверх ногами, под водой, на жирной бумаге и при морозе -30°C.",
							PriceRUB:    950,
							ImageSeed:   "dofamine-space-pen",
						},
					},
				},
			},
		},

		// 2. ⚡ Электроника — 2 500 – 249 990 ₽
		{
			Name: "Электроника",
			Icon: "⚡",
			Subcategories: []subcategoryTemplate{
				{
					Name:        "Беспроводные наушники и аудио Somy",
					Slug:        "electronics-audio-somy",
					Description: "Премиальное шумоподавление, глубокий бас и кристальный Hi-Res звук",
					Products: []productTemplate{
						{
							Name:        "Наушники Somy WH-1000XM6 Dofamine ANC",
							Description: "Флагманский ANC с 12 микрофонами, поддержкой LDAC+ и режимом полной изоляции от реальности.",
							PriceRUB:    39990,
							ImageSeed:   "electronics-somy-wh1000",
						},
						{
							Name:        "TWS-наушники Somy WF-C900 Noise-Buster",
							Description: "Компактные вкладыши с кастомным графеновым драйвером и защитой от влаги IPX7.",
							PriceRUB:    12490,
							ImageSeed:   "electronics-somy-tws",
						},
						{
							Name:        "Портативная колонка Somy ExtraBass Blast 360",
							Description: "60 Вт взрывного баса, RGB стробоскопы, караоке-вход и до 24 часов работы на одном заряде.",
							PriceRUB:    16990,
							ImageSeed:   "electronics-somy-extrabass",
						},
						{
							Name:        "Студийные наушники Somy MDR-Pro Sound",
							Description: "Честная АЧХ, титановые диафрагмы 50 мм и витой кабель из бескислородной меди.",
							PriceRUB:    24990,
							ImageSeed:   "electronics-somy-studio",
						},
						{
							Name:        "Саундбар с сабвуфером Somy Dolby Atmos 7.1",
							Description: "Пространственный звук мощностью 450 Вт с беспроводным сабвуфером для кинотеатра дома.",
							PriceRUB:    48990,
							ImageSeed:   "electronics-somy-soundbar",
						},
						{
							Name:        "Геймерская гарнитура Somy CyberPulse Wireless",
							Description: "Тактильный виброотклик на взрывы, микрофон студийного качества и задержка 15 мс.",
							PriceRUB:    18990,
							ImageSeed:   "electronics-somy-gaming",
						},
						{
							Name:        "Винтажная Bluetooth-акустика Somy RetroWood",
							Description: "Корпус из натурального ореха, аналоговые тумблеры и ласковый ламповый звук.",
							PriceRUB:    21990,
							ImageSeed:   "electronics-somy-retrowood",
						},
						{
							Name:        "Наушники с костной проводимостью Somy BoneActive",
							Description: "Оставляют уши открытыми для безопасности на пробежках по ночному мегаполису.",
							PriceRUB:    9990,
							ImageSeed:   "electronics-somy-bone",
						},
					},
				},
				{
					Name:        "Роботы-пылесосы и клининг",
					Slug:        "electronics-robot-vacuums",
					Description: "Интеллектуальная уборка без участия человека и умные климатические комплексы",
					Products: []productTemplate{
						{
							Name:        "Робот-пылесос RoboClean Ultra Omni AI",
							Description: "Станция самоочистки с сушкой горячим воздухом, LiDAR 4D и распознавание проводов и тапочек.",
							PriceRUB:    79990,
							ImageSeed:   "electronics-roboclean-omni",
						},
						{
							Name:        "Робот-мойщик окон SkyWipe Magnetic Pro",
							Description: "Вакуумное удержание 5 кг, ультразвуковой распылитель и чистка зеркал без разводов.",
							PriceRUB:    22990,
							ImageSeed:   "electronics-skywipe-window",
						},
						{
							Name:        "Моющий пылесос-стик AquaClean H12 Dual",
							Description: "Одновременная сухая и влажная уборка со скоростью 500 об/мин и стерилизацией электролизом.",
							PriceRUB:    34990,
							ImageSeed:   "electronics-aquaclean-stick",
						},
						{
							Name:        "Робот-пылесос RoboClean Slim Laser Max",
							Description: "Толщина всего 7.2 см — проезжает под любой диван, сила всасывания 6000 Па.",
							PriceRUB:    44990,
							ImageSeed:   "electronics-roboclean-slim",
						},
						{
							Name:        "Станция очистки воздуха AirOasis BioGuard",
							Description: "HEPA H14 фильтр, УФ-дезинфекция и естественное испарение 800 мл/ч.",
							PriceRUB:    29990,
							ImageSeed:   "electronics-airoasis-purifier",
						},
						{
							Name:        "Ультразвуковой отпариватель SteamPro Vertical",
							Description: "Готовность за 15 секунд, давление пара 4.5 бар, бережно гладит шелк и тяжелые худи.",
							PriceRUB:    14990,
							ImageSeed:   "electronics-steampro-vertical",
						},
						{
							Name:        "Умная сушилка для обуви ShoDry Ionic",
							Description: "Бережная сушка теплым воздухом 45°C и полное уничтожение бактерий за 30 минут.",
							PriceRUB:    4990,
							ImageSeed:   "electronics-shodry-ionic",
						},
						{
							Name:        "Робот-пылесос базовый RoboClean EcoSmart 2.0",
							Description: "Гироскопическая навигация, сухая и влажная уборка, управление через смартфон.",
							PriceRUB:    16990,
							ImageSeed:   "electronics-roboclean-eco",
						},
					},
				},
				{
					Name:        "8K OLED телевизоры Samsoong & Дисплеи",
					Slug:        "electronics-samsoong-tv",
					Description: "Кинематографические панели с квантовыми точками и бесконечным контрастом",
					Products: []productTemplate{
						{
							Name:        "Телевизор Samsoong Neo 8K QLED Quantum 85\"",
							Description: "Флагманский 85-дюймовый 8K экран, частота 165 Гц, пиковая яркость 3000 нит и AI апскейлинг.",
							PriceRUB:    249990,
							ImageSeed:   "electronics-samsoong-8k-85",
						},
						{
							Name:        "Телевизор Samsoong OLED Infinite Black 65\"",
							Description: "Абсолютный черный цвет, бесконечная контрастность, 4x HDMI 2.1 и игровой режим 144 Гц.",
							PriceRUB:    179990,
							ImageSeed:   "electronics-samsoong-oled-65",
						},
						{
							Name:        "Интерьерный ТВ Samsoong The Frame Gallery 55\"",
							Description: "Матовое антибликовое покрытие, рамка из натурального дуба и режим картинной галереи.",
							PriceRUB:    119990,
							ImageSeed:   "electronics-samsoong-frame-55",
						},
						{
							Name:        "Лазерный 4K проектор Samsoong CinemaPocket",
							Description: "Автофокус, автокоррекция трапеции, картинка до 120 дюймов на любой стене или потолке.",
							PriceRUB:    59990,
							ImageSeed:   "electronics-samsoong-projector",
						},
						{
							Name:        "Телевизор Samsoong Crystal UHD 4K Smart 50\"",
							Description: "Тонкий корпус AirSlim, сочные реалистичные цвета и голосовое управление.",
							PriceRUB:    42990,
							ImageSeed:   "electronics-samsoong-uhd-50",
						},
						{
							Name:        "Изогнутый игровой ТВ Samsoong Odyssey Ark 43\"",
							Description: "Радиус кривизны 1000R, время отклика 1 мс и поворот в портретный режим Cockpit.",
							PriceRUB:    139990,
							ImageSeed:   "electronics-samsoong-odyssey-ark",
						},
						{
							Name:        "Медиаплеер Samsoong SmartHub 8K Ultra HDR",
							Description: "Поддержка AV1, Dolby Vision, Wi-Fi 6E и мгновенный запуск любых стримингов.",
							PriceRUB:    11990,
							ImageSeed:   "electronics-samsoong-smarthub",
						},
						{
							Name:        "Всепогодный ТВ Samsoong Terrace Outdoor 55\"",
							Description: "Водозащита IP55, антибликовый экран 2000 нит для просмотра на летней веранде.",
							PriceRUB:    219990,
							ImageSeed:   "electronics-samsoong-terrace",
						},
					},
				},
				{
					Name:        "Умный дом и климат-контроль",
					Slug:        "electronics-smart-home",
					Description: "Автоматизация комфорта, биометрические замки и сенсоры безопасности",
					Products: []productTemplate{
						{
							Name:        "Центр умного дома SmartHub Pro Matter/Zigbee",
							Description: "Поддержка протоколов Matter, Zigbee 3.0, Thread и локальное исполнение сценариев без интернета.",
							PriceRUB:    8990,
							ImageSeed:   "electronics-smarthub-matter",
						},
						{
							Name:        "Умный замок с FaceID и биометрией SmartLock Pro",
							Description: "Открытие по 3D лицу, отпечатку пальца, PIN-коду и NFC. Видеоглазок с ночной съемкой.",
							PriceRUB:    24990,
							ImageSeed:   "electronics-smartlock-face",
						},
						{
							Name:        "Светодиодная лента DreamColor Neo RGBIC 5м",
							Description: "Синхронизация с музыкой и экраном монитора, плавный градиент и 16 млн оттенков.",
							PriceRUB:    3990,
							ImageSeed:   "electronics-smart-rgbic",
						},
						{
							Name:        "Моторизованный карниз для штор SmartCurtain",
							Description: "Бесшумный мотор, открытие по расписанию рассвета или датчику освещенности комнаты.",
							PriceRUB:    12490,
							ImageSeed:   "electronics-smart-curtain",
						},
						{
							Name:        "Набор датчиков безопасности SmartSafe (5 в 1)",
							Description: "Датчики протечки воды, движения, открытия окон, задымления и температуры воздуха.",
							PriceRUB:    6990,
							ImageSeed:   "electronics-smartsafe-kit",
						},
						{
							Name:        "Умный терморегулятор SmartClima Touch LCD",
							Description: "Управление теплыми полами и радиаторами с умным алгоритмом экономии электроэнергии.",
							PriceRUB:    5490,
							ImageSeed:   "electronics-smartclima-lcd",
						},
						{
							Name:        "Умная розетка с ваттметром SmartPlug (3 шт)",
							Description: "Мониторинг расхода киловатт в реальном времени, таймеры и защита от перегрузки сети.",
							PriceRUB:    2990,
							ImageSeed:   "electronics-smartplug-trio",
						},
						{
							Name:        "Умная кормушка для питомцев с HD-камерой PetFeeder",
							Description: "Двусторонняя аудиосвязь, выдача корма по граммам и ночное наблюдение за котиками.",
							PriceRUB:    10990,
							ImageSeed:   "electronics-petfeeder-camera",
						},
					},
				},
			},
		},

		// 3. 💻 Компьютеры & Железо — 1 900 – 239 990 ₽
		{
			Name: "Компьютеры & Железо",
			Icon: "💻",
			Subcategories: []subcategoryTemplate{
				{
					Name:        "Видеокарты Nwidia GeForce RTX",
					Slug:        "hardware-gpu-nwidia",
					Description: "Топовые графические ускорители для 4K гейминга, 3D рендеринга и обучения нейросетей",
					Products: []productTemplate{
						{
							Name:        "Видеокарта Nwidia GeForce RTX 5090 Ti Megalodon 32GB",
							Description: "Монстр производительности: 32 ГБ GDDR7, DLSS 4.0 Neural Render и 600 Вт TDP.",
							PriceRUB:    239990,
							ImageSeed:   "hardware-nwidia-rtx5090ti",
						},
						{
							Name:        "Видеокарта Nwidia GeForce RTX 5080 Super Horizon 16GB",
							Description: "Бескомпромиссный 4K гейминг на ультра-настройках с трассировкой лучей и Frame Gen.",
							PriceRUB:    149990,
							ImageSeed:   "hardware-nwidia-rtx5080",
						},
						{
							Name:        "Видеокарта Nwidia GeForce RTX 5070 DualFan OC 12GB",
							Description: "Идеальный выбор для 2K разрешения: тихая система охлаждения и низкое энергопотребление.",
							PriceRUB:    84990,
							ImageSeed:   "hardware-nwidia-rtx5070",
						},
						{
							Name:        "Видеокарта Nwidia GeForce RTX 5060 Compact 8GB",
							Description: "Народный хит для киберспорта и стриминга с аппаратным кодеком AV1.",
							PriceRUB:    49990,
							ImageSeed:   "hardware-nwidia-rtx5060",
						},
						{
							Name:        "Кастомный водоблок для RTX 5090 LiquidMaster",
							Description: "Медная пластина с никелированием и микроканалами для ледяных температур GPU под нагрузкой.",
							PriceRUB:    24990,
							ImageSeed:   "hardware-waterblock-rtx5090",
						},
						{
							Name:        "Вертикальный держатель видеокарты с ARGB",
							Description: "Предотвращает провисание тяжелых трехслотовых карт и эффектно подсвечивает систему.",
							PriceRUB:    2990,
							ImageSeed:   "hardware-gpu-holder-rgb",
						},
						{
							Name:        "Райзер-кабель PCIe 5.0 x16 UltraShield 200mm",
							Description: "Экранированный гибкий шлейф без потерь пропускной способности для вертикальной посадки.",
							PriceRUB:    4490,
							ImageSeed:   "hardware-pcie5-riser",
						},
						{
							Name:        "Внешний графический бокс eGPU Thunderbolt 4",
							Description: "Превращает компактный ноутбук в мощную рабочую станцию с внешней видеокартой.",
							PriceRUB:    39990,
							ImageSeed:   "hardware-egpu-enclosure",
						},
					},
				},
				{
					Name:        "Процессоры Intell & Материнские платы",
					Slug:        "hardware-cpu-motherboards",
					Description: "Вычислительные ядра экстремальной частоты и надежные оверклокерские платы",
					Products: []productTemplate{
						{
							Name:        "Процессор Intell Core i9-15900K Unlocked 24-Core",
							Description: "24 ядра, 32 потока, буст до 6.2 ГГц и рекордная однопоточная скорость компиляции.",
							PriceRUB:    79990,
							ImageSeed:   "hardware-intell-i9-15900k",
						},
						{
							Name:        "Процессор Intell Core i7-15700KF Gaming Beast",
							Description: "20 ядер чистой мощи без переплаты за встроенную графику, отборный кремниевый кристалл.",
							PriceRUB:    52990,
							ImageSeed:   "hardware-intell-i7-15700kf",
						},
						{
							Name:        "Процессор Intell Core i5-15600K Master Edition",
							Description: "Оптимальный баланс для работы и игр с кэшем третьего уровня 36 МБ.",
							PriceRUB:    34990,
							ImageSeed:   "hardware-intell-i5-15600k",
						},
						{
							Name:        "Материнская плата Intell Z890 Titanium Wi-Fi 7",
							Description: "20+1 фаза питания, поддержка DDR5 8400+ МГц, 5 слотов M.2 NVMe с массивными радиаторами.",
							PriceRUB:    46990,
							ImageSeed:   "hardware-mobo-z890-titanium",
						},
						{
							Name:        "Материнская плата Intell B860 Tomahawk Pro",
							Description: "Надежная рабочая лошадка с усиленным слотом PCIe 5.0 и 2.5G LAN сетевым адаптером.",
							PriceRUB:    22990,
							ImageSeed:   "hardware-mobo-b860-tomahawk",
						},
						{
							Name:        "Система водяного охлаждения 360mm LiquidChill LCD",
							Description: "IPS-дисплей на помпе для вывода GIF-анимаций и температур, три бесшумных 120мм кулера.",
							PriceRUB:    19990,
							ImageSeed:   "hardware-liquid-cooler-lcd",
						},
						{
							Name:        "Оперативная память DDR5 64GB (2x32GB) 7200MHz RGB",
							Description: "Низкие тайминги CL32, алюминиевые радиаторы охлаждения и профили XMP 3.0.",
							PriceRUB:    27990,
							ImageSeed:   "hardware-ram-ddr5-64gb",
						},
						{
							Name:        "SSD NVMe M.2 4TB Gen5 HyperSpeed 14000 MB/s",
							Description: "Мгновенная загрузка локаций в играх и молниеносный экспорт тяжелых 8K видеороликов.",
							PriceRUB:    36990,
							ImageSeed:   "hardware-ssd-gen5-4tb",
						},
					},
				},
				{
					Name:        "Игровые ноутбуки CyberBeast & ПК",
					Slug:        "hardware-laptops-pc",
					Description: "Мощные портативные станции и кастомные компьютеры в аквариумных корпусах",
					Products: []productTemplate{
						{
							Name:        "Игровой ноутбук CyberBeast 17 Pro Max OLED 240Hz",
							Description: "Core i9, RTX 5090 Mobile, 64GB RAM, 2TB SSD и 17.3\" 4K OLED экран с калибровкой цвета.",
							PriceRUB:    229990,
							ImageSeed:   "hardware-laptop-cyberbeast-17",
						},
						{
							Name:        "Ультрабук разработчика CyberBook DevStudio 14\"",
							Description: "Магниевый корпус весом 1.1 кг, 32GB RAM, 18 часов автономности и тактильная клавиатура.",
							PriceRUB:    139990,
							ImageSeed:   "hardware-laptop-cyberbook-14",
						},
						{
							Name:        "Кастомный ПК CyberBeast Orion RTX 5080 Liquid",
							Description: "Панорамный аквариум-корпус, кастомная СЖО на акриловых трубках и безупречный кабель-менеджмент.",
							PriceRUB:    219990,
							ImageSeed:   "hardware-pc-cyberbeast-orion",
						},
						{
							Name:        "Игровой ноутбук CyberBeast 15 Stealth Edition",
							Description: "Core i7, RTX 5070, тонкий алюминиевый корпус и матовый QHD 165Hz дисплей.",
							PriceRUB:    114990,
							ImageSeed:   "hardware-laptop-cyberbeast-15",
						},
						{
							Name:        "Портативная консоль CyberDeck OLED 1TB",
							Description: "Стики на датчиках Холла, 7\" яркий OLED экран и запуск всех игр из библиотеки Steam.",
							PriceRUB:    69990,
							ImageSeed:   "hardware-console-cyberdeck",
						},
						{
							Name:        "Мини-ПК CyberCube Workstation Ryzen 9 / 32GB",
							Description: "Компактный кубик размером с кружку кофе, способный тянуть монтаж и параллельную компиляцию.",
							PriceRUB:    64990,
							ImageSeed:   "hardware-minipc-cybercube",
						},
						{
							Name:        "Подставка с турбо-охлаждением IceStorm RGB",
							Description: "Турбинный вентилятор 2800 об/мин снижает нагрев процессора ноутбука на 15°C.",
							PriceRUB:    5490,
							ImageSeed:   "hardware-laptop-cooler-stand",
						},
						{
							Name:        "Блок питания 1200W Titanium ATX 3.1 CyberPower",
							Description: "Японские конденсаторы 105°C, кабель 12V-2x6 и полностью бесшумный пассивный режим.",
							PriceRUB:    26990,
							ImageSeed:   "hardware-psu-1200w-titanium",
						},
					},
				},
				{
					Name:        "Механические клавиатуры, мыши & Мониторы",
					Slug:        "hardware-peripherals",
					Description: "Кастомная периферия, OLED-мониторы с ультранизким откликом и эргономика",
					Products: []productTemplate{
						{
							Name:        "Монитор 34\" QD-OLED Ultrawide 175Hz Curved",
							Description: "Формат 21:9, радиус 1800R, время отклика 0.03 мс и сертификат DisplayHDR True Black 400.",
							PriceRUB:    89990,
							ImageSeed:   "hardware-monitor-qdoled-34",
						},
						{
							Name:        "Кастомная клавиатура CyberKeys Gasket Pro",
							Description: "Тяжелый алюминиевый корпус, Hot-Swap, смазанные свитчи Linear Thock и звукоизоляция Poron.",
							PriceRUB:    16990,
							ImageSeed:   "hardware-keyboard-cyberkeys",
						},
						{
							Name:        "Беспроводная мышь CyberMouse Ultralight 49g 8K",
							Description: "Оптический сенсор 36000 DPI, оптические кликеры и частота опроса порта 8000 Гц.",
							PriceRUB:    9990,
							ImageSeed:   "hardware-mouse-cybermouse-8k",
						},
						{
							Name:        "Кронштейн для двух мониторов HeavyDuty GasSpring",
							Description: "Газлифт премиум-класса выдерживает экраны до 49 дюймов с легким 3D позиционированием.",
							PriceRUB:    7990,
							ImageSeed:   "hardware-monitor-arm-dual",
						},
						{
							Name:        "Ковер для мыши Cordura Speed Control 900x400",
							Description: "Износостойкая ткань Cordura с водоотталкивающим нанопокрытием и прошитыми краями.",
							PriceRUB:    2490,
							ImageSeed:   "hardware-mousepad-cordura",
						},
						{
							Name:        "USB-микрофон студийный с поп-фильтром ProStream",
							Description: "Кардиоидная позолоченная капсула, сенсорный Mute и мониторинг голоса без задержки.",
							PriceRUB:    8490,
							ImageSeed:   "hardware-mic-prostream",
						},
						{
							Name:        "Эргономичная вертикальная мышь ErgoGrip Wireless",
							Description: "Угол наклона 57 градусов для анатомически правильного положения руки без усталости.",
							PriceRUB:    4290,
							ImageSeed:   "hardware-mouse-ergogrip",
						},
						{
							Name:        "Набор PBT кейкапов «Cyberpunk Neon 2077»",
							Description: "Толстый PBT пластик 1.5 мм, профиль Cherry и сублимация символов без риска стирания.",
							PriceRUB:    3490,
							ImageSeed:   "hardware-keycaps-cyberpunk",
						},
					},
				},
			},
		},

		// 4. 👑 Бренды & Премиум — 45 000 – 250 000 ₽
		{
			Name: "Бренды & Премиум",
			Icon: "👑",
			Subcategories: []subcategoryTemplate{
				{
					Name:        "Экосистема PineApple",
					Slug:        "luxury-pineapple",
					Description: "Статусные смартфоны, ультрабуки и аксессуары из Купертино в титановых корпусах",
					Products: []productTemplate{
						{
							Name:        "Смартфон PineApple Phone 16 Pro Max 1TB Titanium",
							Description: "Корпус из аэрокосмического титана, чип A18 Bionic, кнопка Dofamine Action и 5x тетрапризма.",
							PriceRUB:    189990,
							ImageSeed:   "luxury-pineapple-phone16",
						},
						{
							Name:        "Ноутбук PineBook Ultra M4 Max 16\" 64GB Liquid",
							Description: "Экран Liquid Retina XDR с нанотекстурой, 24 часа работы и вычислительная мощь суперкомпьютера.",
							PriceRUB:    249990,
							ImageSeed:   "luxury-pineapple-book-m4",
						},
						{
							Name:        "Наушники накладные PinePods Max Space Gold",
							Description: "Амбушюры из акустической пены с эффектом памяти, колесико Digital Crown и прозрачный режим.",
							PriceRUB:    62990,
							ImageSeed:   "luxury-pineapple-pods-max",
						},
						{
							Name:        "Смарт-часы PineWatch Ultra 2 Titanium Ocean",
							Description: "Дисплей 3000 нит, глубиномер до 40 м, сирена 86 дБ и двухчастотный высокоточный GPS.",
							PriceRUB:    79990,
							ImageSeed:   "luxury-pineapple-watch-ultra",
						},
						{
							Name:        "Планшет PinePad Pro 13\" M4 OLED Ultra",
							Description: "Толщина всего 5.1 мм, тандемный OLED дисплей и поддержка стилуса с тактильным откликом.",
							PriceRUB:    134990,
							ImageSeed:   "luxury-pineapple-pad-pro",
						},
						{
							Name:        "Монитор PineDisplay Pro XDR 32\" 6K Retina",
							Description: "576 зон локального затемнения, точность цветопередачи P3 и стекло с наногравировкой.",
							PriceRUB:    199990,
							ImageSeed:   "luxury-pineapple-display-xdr",
						},
						{
							Name:        "Рабочая станция PineStudio M4 Ultra Desktop",
							Description: "128GB объединенной памяти, бесшумная система охлаждения и колоссальная скорость рендеринга.",
							PriceRUB:    250000,
							ImageSeed:   "luxury-pineapple-studio",
						},
						{
							Name:        "VR-гарнитура PineVision Pro Spatial Computing",
							Description: "Пространственный компьютер с micro-OLED 23 млн пикселей, трекингом глаз и жестов.",
							PriceRUB:    249990,
							ImageSeed:   "luxury-pineapple-vision-pro",
						},
					},
				},
				{
					Name:        "Техника для красоты и дома Pileson",
					Slug:        "luxury-pileson",
					Description: "Легендарные мультистайлеры, лазерные пылесосы и климатические станции",
					Products: []productTemplate{
						{
							Name:        "Мультистайлер Pileson Airwrap Complete Long",
							Description: "Эффект Коанда для идеальной завивки без перегрева, ионизация и кожаный чехол в комплекте.",
							PriceRUB:    68990,
							ImageSeed:   "luxury-pileson-airwrap",
						},
						{
							Name:        "Фен для волос Pileson Supersonic Nural Intel",
							Description: "Датчики расстояния автоматически снижают температуру у кожи головы, защищая блеск волос.",
							PriceRUB:    54990,
							ImageSeed:   "luxury-pileson-supersonic",
						},
						{
							Name:        "Пылесос Pileson V15 Detect Absolute Laser",
							Description: "Зеленый лазер подсвечивает невидимую микропыль, пьезодатчик непрерывно считает частицы.",
							PriceRUB:    78990,
							ImageSeed:   "luxury-pileson-v15-laser",
						},
						{
							Name:        "Робот-пылесос Pileson 360 Heurist Robot Vision",
							Description: "Танковые гусеницы преодолевают пороги, циклонный двигатель со скоростью 78000 об/мин.",
							PriceRUB:    119990,
							ImageSeed:   "luxury-pileson-robot-360",
						},
						{
							Name:        "Климатический комплекс Pileson Purifier Humidify",
							Description: "Каталитический фильтр навсегда разрушает формальдегид и увлажняет очищенной водой.",
							PriceRUB:    89990,
							ImageSeed:   "luxury-pileson-purifier",
						},
						{
							Name:        "Выпрямитель волос Pileson Corrale Flexible",
							Description: "Марганцево-медные пластины бережно собирают пряди, снижая ломкость волос в 2 раза.",
							PriceRUB:    49990,
							ImageSeed:   "luxury-pileson-corrale",
						},
						{
							Name:        "Аудио-маска с очисткой воздуха Pileson Zone ANC",
							Description: "Очищенный поток воздуха к лицу в сочетании с бескомпромиссным активным шумоподавлением.",
							PriceRUB:    74990,
							ImageSeed:   "luxury-pileson-zone",
						},
						{
							Name:        "Стайлер для влажных волос Pileson Airstrait",
							Description: "Выпрямляет волосы воздушным потоком прямо из мокрого состояния без раскаленных пластин.",
							PriceRUB:    59990,
							ImageSeed:   "luxury-pileson-airstrait",
						},
					},
				},
				{
					Name:        "Люксовые часы Rolexxx & Золото",
					Slug:        "luxury-rolexxx",
					Description: "Швейцарская механика в желтом золоте, хронометры и инвестиционные активы",
					Products: []productTemplate{
						{
							Name:        "Часы Rolexxx Submariner Date 18k Yellow Gold",
							Description: "Корпус из литого 18-каратного золота, безель Cerachrom и водонепроницаемость до 300 м.",
							PriceRUB:    250000,
							ImageSeed:   "luxury-rolexxx-submariner-gold",
						},
						{
							Name:        "Хронограф Rolexxx Cosmograph Daytona Platinum",
							Description: "Платиновый корпус с ледяным циферблатом, тахиметрическая шкала и калибр с автоподзаводом.",
							PriceRUB:    249990,
							ImageSeed:   "luxury-rolexxx-daytona-ice",
						},
						{
							Name:        "Часы Rolexxx Day-Date Presidential Olive Green",
							Description: "Президентский браслет, индикация дня недели прописью и знаменитый рифленый безель.",
							PriceRUB:    235000,
							ImageSeed:   "luxury-rolexxx-daydate-green",
						},
						{
							Name:        "Часы Rolexxx GMT-Master II «Pepsi» Jubilee",
							Description: "Красно-синий керамический безель для второго часового пояса на браслете Jubilee.",
							PriceRUB:    195000,
							ImageSeed:   "luxury-rolexxx-gmt-pepsi",
						},
						{
							Name:        "Часы Rolexxx Sky-Dweller Annual Rose Gold",
							Description: "Годовой календарь Saros, индикация второго пояса на вращающемся диске и розовое золото.",
							PriceRUB:    245000,
							ImageSeed:   "luxury-rolexxx-skydweller-gold",
						},
						{
							Name:        "Часы Rolexxx Explorer II Polar White Dial",
							Description: "Оранжевая 24-часовая стрелка для полярных экспедиций и сталь повышенной прочности Oystersteel.",
							PriceRUB:    165000,
							ImageSeed:   "luxury-rolexxx-explorer-polar",
						},
						{
							Name:        "Часы Rolexxx Oyster Perpetual Turquoise Blue",
							Description: "Яркий бирюзовый циферблат Tiffany, минималистичный стальной корпус и 70 часов запаса хода.",
							PriceRUB:    125000,
							ImageSeed:   "luxury-rolexxx-oyster-tiffany",
						},
						{
							Name:        "Золотой слиток-брелок 999 пробы Mint 10g",
							Description: "Сертифицированный слиток чистого золота в защитной капсуле с индивидуальным серийным номером.",
							PriceRUB:    89990,
							ImageSeed:   "luxury-rolexxx-gold-bar",
						},
					},
				},
				{
					Name:        "Высокая мода Cucci & Balenciago Deluxe",
					Slug:        "luxury-couture",
					Description: "Пародийный люксовый кутюр, кожаные мусорные пакеты и монограммные худи",
					Products: []productTemplate{
						{
							Name:        "Мусорный пакет Balenciago Trash Pouch Deluxe",
							Description: "Легендарный аксессуар из мягчайшей телячьей кожи с шелковыми завязками для выноса мусора со стилем.",
							PriceRUB:    145000,
							ImageSeed:   "luxury-balenciago-trash-bag",
						},
						{
							Name:        "Оверсайз худи Cucci с золотым вышитым котом",
							Description: "Тяжелый органический хлопок 650 г/м², ручная вышивка золотыми нитями и винтажная фурнитура.",
							PriceRUB:    89990,
							ImageSeed:   "luxury-cucci-hoodie-cat",
						},
						{
							Name:        "Кроссовки Balenciago Triple S Distressed Max",
							Description: "Трехслойная подошва высотой 6 см с эффектом заводской потертости и грязи за бешеные деньги.",
							PriceRUB:    98000,
							ImageSeed:   "luxury-balenciago-triples",
						},
						{
							Name:        "Кожаная сумка-шоппер Cucci GG Supreme Monogram",
							Description: "Знаменитый канвас, отделка натуральной кожей и вместимость для ноутбука 16 дюймов.",
							PriceRUB:    165000,
							ImageSeed:   "luxury-cucci-shopper-gg",
						},
						{
							Name:        "Шелковый бомбер Cucci Flora Psychedelic",
							Description: "Двусторонний итальянский шелк саржевого переплетения с психоделическим цветочным паттерном.",
							PriceRUB:    175000,
							ImageSeed:   "luxury-cucci-silk-bomber",
						},
						{
							Name:        "Кожаный чемодан Cucci Heritage Trolley",
							Description: "Чемодан ручной работы из зернистой кожи с кодовым замком и телескопической ручкой.",
							PriceRUB:    210000,
							ImageSeed:   "luxury-cucci-luggage",
						},
						{
							Name:        "Кроссовки-носки Balenciago Speed 2.0 Knit",
							Description: "Трикотажный 3D-носок на сегментированной подошве с невероятным эффектом невесомости.",
							PriceRUB:    75000,
							ImageSeed:   "luxury-balenciago-speed",
						},
						{
							Name:        "Мини-сумка Balenciago Hourglass Metallic",
							Description: "Изогнутое дно силуэта песочных часов, тисненая зеркальная кожа и золотая буква B.",
							PriceRUB:    120000,
							ImageSeed:   "luxury-balenciago-hourglass",
						},
					},
				},
			},
		},

		// 5. 👕 Одежда & Стритвир — 490 – 12 990 ₽
		{
			Name: "Одежда & Стритвир",
			Icon: "👕",
			Subcategories: []subcategoryTemplate{
				{
					Name:        "Худи «404» и мерч деплоя",
					Slug:        "streetwear-hoodies-merch",
					Description: "Стильные оверсайз худи, футболки с принтами для программистов и разработчиков",
					Products: []productTemplate{
						{
							Name:        "Оверсайз худи «404 Not Found» Heavyweight 500g",
							Description: "Плотный начес, объемный двойной капюшон и шелкография с рефлективным эффектом.",
							PriceRUB:    5990,
							ImageSeed:   "streetwear-hoodie-404",
						},
						{
							Name:        "Футболка «Деплой в пятницу — слабоумие и отвага»",
							Description: "100% чесаный хлопок, стойкий DTF-принт, заряженный на успешный релиз без отката.",
							PriceRUB:    2490,
							ImageSeed:   "streetwear-tshirt-friday-deploy",
						},
						{
							Name:        "Худи «It’s not a bug, it’s a feature»",
							Description: "Классический программистский манифест в глубоком черном цвете с карманом-кенгуру.",
							PriceRUB:    4990,
							ImageSeed:   "streetwear-hoodie-feature",
						},
						{
							Name:        "Свитшот «Git Push --Force» с вышивкой",
							Description: "Минималистичная аккуратная вышивка на груди для самых решительных разработчиков.",
							PriceRUB:    4490,
							ImageSeed:   "streetwear-sweatshirt-git-force",
						},
						{
							Name:        "Лонгслив «Coffee -> Code -> Repeat»",
							Description: "Свободный крой, удлиненные рукава с манжетами и дышащая трикотажная ткань.",
							PriceRUB:    3290,
							ImageSeed:   "streetwear-longsleeve-coffee",
						},
						{
							Name:        "Футболка «Junior / Middle / Senior / Tired»",
							Description: "Правдивая градация карьерного роста с отмеченным галочкой последним пунктом.",
							PriceRUB:    2290,
							ImageSeed:   "streetwear-tshirt-career",
						},
						{
							Name:        "Кепка-бейсболка «Syntax Error» с пряжкой",
							Description: "Шестиклинка из плотного хлопка твил с регулировкой размера и объемной вышивкой.",
							PriceRUB:    1990,
							ImageSeed:   "streetwear-cap-syntax-error",
						},
						{
							Name:        "Вязаная шапка-бини «Segfault»",
							Description: "Двойная акриловая вязка, плотная посадка и светоотражающая термоаппликация.",
							PriceRUB:    1690,
							ImageSeed:   "streetwear-beanie-segfault",
						},
					},
				},
				{
					Name:        "Кроссовки Nikey & Adibas",
					Slug:        "streetwear-sneakers",
					Description: "Стритвир сникеры на воздушных баллонах и пене повышенной амортизации",
					Products: []productTemplate{
						{
							Name:        "Кроссовки Nikey Air Max Dofamine Flyknit",
							Description: "Полноразмерная воздушная капсула Air, дышащий верх Flyknit и цветная флуоресцентная подошва.",
							PriceRUB:    11990,
							ImageSeed:   "streetwear-nikey-air-dofamine",
						},
						{
							Name:        "Кроссовки Adibas Yeezy SuperBoost 350 V3",
							Description: "Подошва из гранулированной пены Boost, анатомический носок Primeknit и невесомая амортизация.",
							PriceRUB:    12990,
							ImageSeed:   "streetwear-adibas-yeezy-boost",
						},
						{
							Name:        "Кроссовки Nikey Dunk Low Retro «Cyber Panda»",
							Description: "Культовый силуэт из натуральной кожи в контрастной черно-белой неоновой расцветке.",
							PriceRUB:    9490,
							ImageSeed:   "streetwear-nikey-dunk-panda",
						},
						{
							Name:        "Кроссовки Adibas Forum Low 84 Vintage",
							Description: "Баскетбольная классика с ремешком на липучке, замшевыми вставками и состаренной подошвой.",
							PriceRUB:    8990,
							ImageSeed:   "streetwear-adibas-forum-84",
						},
						{
							Name:        "Кеды Skate Classic Canvas High-Top",
							Description: "Прочный канвас, вулканизированная вафельная подошва и усиленный резиновый носок.",
							PriceRUB:    5490,
							ImageSeed:   "streetwear-skate-hightop",
						},
						{
							Name:        "Кроссовки трейловые MudClaw Gore-Tex",
							Description: "Непромокаемая мембрана, агрессивный протектор Vibram и быстрая шнуровка QuickLace.",
							PriceRUB:    10490,
							ImageSeed:   "streetwear-trail-goretex",
						},
						{
							Name:        "Сланцы Adibas Slide Foam Cloud",
							Description: "Цельнолитая пена EVA, массажная стелька и космический комфорт для дома и улицы.",
							PriceRUB:    2990,
							ImageSeed:   "streetwear-adibas-slides",
						},
						{
							Name:        "Набор для чистки обуви SneakerCare Pro",
							Description: "Чистящая пена, щетка из конского волоса, микрофибра и гидрофобная водоотталкивающая пропитка.",
							PriceRUB:    1890,
							ImageSeed:   "streetwear-sneakercare-kit",
						},
					},
				},
				{
					Name:        "Пуховики Zora & Киберпанк ветровки",
					Slug:        "streetwear-outerwear",
					Description: "Объемные дутые пуховики, непродуваемые мембранные анораки и теквир",
					Products: []productTemplate{
						{
							Name:        "Пуховик Zora Cloud Puff Oversize Metallic",
							Description: "Наполнитель из натурального утиного пуха 90/10, фольгированная ткань и ветрозащитный воротник.",
							PriceRUB:    10990,
							ImageSeed:   "streetwear-zora-cloud-puff",
						},
						{
							Name:        "Ветровка-анорак Cyberpunk Techwear Reflective",
							Description: "Водостойкая мембрана 10000/10000, стропы, карабины и светящиеся в свете фар полосы.",
							PriceRUB:    7990,
							ImageSeed:   "streetwear-cyberpunk-anorak",
						},
						{
							Name:        "Бомбер авиатор Alpha MA-1 Tactical Olive",
							Description: "Классическая оранжевая подкладка, карман для ручек на рукаве и плотный нейлон Flight Nylon.",
							PriceRUB:    8490,
							ImageSeed:   "streetwear-bomber-ma1",
						},
						{
							Name:        "Дождевик-плащ Holographic RainCoat",
							Description: "Голографический полупрозрачный полиуретан, проклеенные швы и глубокий козырек.",
							PriceRUB:    4490,
							ImageSeed:   "streetwear-raincoat-holo",
						},
						{
							Name:        "Джинсовая куртка Sherpa Trucker с мехом",
							Description: "Плотный деним 14 oz, теплая подкладка из шерпы и медные пуговицы болты.",
							PriceRUB:    6990,
							ImageSeed:   "streetwear-denim-sherpa",
						},
						{
							Name:        "Жилет утепленный Puffer Vest Stealth Black",
							Description: "Легкий стеганый жилет с синтепоновым утеплителем и карманами на молниях YKK.",
							PriceRUB:    4990,
							ImageSeed:   "streetwear-puffer-vest",
						},
						{
							Name:        "Парка зимняя Arctic Explorer до -30°C",
							Description: "Мембранная ткань с защитой от метели, 8 функциональных карманов и капюшон с мехом.",
							PriceRUB:    11990,
							ImageSeed:   "streetwear-parka-arctic",
						},
						{
							Name:        "Флисовая кофта с высоким воротом PolarFleece",
							Description: "Сверхтеплый ворсистый флис согревает даже в сырую холодную осеннюю погоду.",
							PriceRUB:    3990,
							ImageSeed:   "streetwear-fleece-polar",
						},
					},
				},
				{
					Name:        "Носки программиста & Аксессуары",
					Slug:        "streetwear-accessories",
					Description: "Мемные носки, водонепроницаемые рюкзаки и тактические ремни",
					Products: []productTemplate{
						{
							Name:        "Набор носков «5 дней без падений прода» (5 пар)",
							Description: "Каждая пара с уникальным бинарным паттерном и укрепленной пяткой из бамбукового волокна.",
							PriceRUB:    1290,
							ImageSeed:   "streetwear-socks-uptime",
						},
						{
							Name:        "Носки с надписью «В продакшн без тестов»",
							Description: "Смелый стейтмент для настоящих ковбоев клавиатуры и любителей острых ощущений.",
							PriceRUB:    490,
							ImageSeed:   "streetwear-socks-notests",
						},
						{
							Name:        "Рюкзак городской RollTop Waterproof 25L",
							Description: "Отделение для ноутбука 16\" с мягкой защитой, магнитная пряжка Fidlock и герметичный отсек.",
							PriceRUB:    4990,
							ImageSeed:   "streetwear-backpack-rolltop",
						},
						{
							Name:        "Сумка-мессенджер через плечо Crossbody Mini",
							Description: "Удобная сумка для телефона, ключей, паспорта и повербанка из износостойкой ткани Cordura.",
							PriceRUB:    2790,
							ImageSeed:   "streetwear-bag-crossbody",
						},
						{
							Name:        "Ремень тактический с пряжкой Cobra Quick-Release",
							Description: "Выдерживает нагрузку до 200 кг, мгновенно расстегивается нажатием двух рычажков.",
							PriceRUB:    1490,
							ImageSeed:   "streetwear-belt-cobra",
						},
						{
							Name:        "Кожаный картхолдер с RFID-защитой Minimalist",
							Description: "Вмещает до 8 карт и наличные, блокирует несанкционированное сканирование PayPass.",
							PriceRUB:    1690,
							ImageSeed:   "streetwear-cartholder-rfid",
						},
						{
							Name:        "Шарф теплый вязаный крупной вязки Cozy Wool",
							Description: "Длина 2 метра, мягкая полушерсть, согревает горло на прогулках за стаканчиком латте.",
							PriceRUB:    2190,
							ImageSeed:   "streetwear-scarf-wool",
						},
						{
							Name:        "Набор металлических пинов «Dev Icons» (6 шт)",
							Description: "Эмалированные значки с логотипами любимых технологий и культовых мемов.",
							PriceRUB:    890,
							ImageSeed:   "streetwear-pins-devicons",
						},
					},
				},
			},
		},

		// 6. 🍕 Еда & Рестораны — 300 – 1 890 ₽
		{
			Name: "Еда & Рестораны",
			Icon: "🍕",
			Subcategories: []subcategoryTemplate{
				{
					Name:        "Сочный шашлык на углях & Стейки",
					Slug:        "food-bbq-meat",
					Description: "Горячее мясо на березовых углях, стейки слабой прожарки и сочные люля-кебабы",
					Products: []productTemplate{
						{
							Name:        "Сочный шашлык из свиной шейки на углях (350г)",
							Description: "Маринованный в кавказских травах и луковом соке, подается с маринованным луком и лавашом.",
							PriceRUB:    690,
							ImageSeed:   "food-shashlik-pork",
						},
						{
							Name:        "Шашлык из филе индейки с розмарином (300г)",
							Description: "Диетическое сочное мясо птицы, приготовленное на углях до аппетитной золотистой корочки.",
							PriceRUB:    620,
							ImageSeed:   "food-shashlik-turkey",
						},
						{
							Name:        "Люля-кебаб из отборной баранины (250г)",
							Description: "Традиционный рубленый фарш с кинзой и специями, запеченный на широком шампуре.",
							PriceRUB:    580,
							ImageSeed:   "food-kebab-lamb",
						},
						{
							Name:        "Стейк Рибай Прайм зернового откорма (350г)",
							Description: "Премиальная мраморная говядина слабой прожарки Medium с чесночным сливочным маслом и тимьяном.",
							PriceRUB:    1890,
							ImageSeed:   "food-steak-ribeye",
						},
						{
							Name:        "Свиные ребрышки BBQ в медовой глазури (450г)",
							Description: "Мясо томится 6 часов в смокере и буквально отстает от кости при прикосновении.",
							PriceRUB:    890,
							ImageSeed:   "food-bbq-ribs",
						},
						{
							Name:        "Шашлык из тигровых креветок на гриле (200г)",
							Description: "Крупные креветки на гриле в чесночно-имбирном маринаде с долькой лайма.",
							PriceRUB:    790,
							ImageSeed:   "food-shrimp-skewer",
						},
						{
							Name:        "Овощи на гриле с соусом песто (250г)",
							Description: "Баклажаны, цукини, сладкий болгарский перец и шампиньоны с дымком.",
							PriceRUB:    450,
							ImageSeed:   "food-grilled-veggies",
						},
						{
							Name:        "Соус фирменный Сацебели к мясу (100г)",
							Description: "Свежие томаты, чеснок, кинза, хмели-сунели и острый стручковый перец.",
							PriceRUB:    300,
							ImageSeed:   "food-sauce-sacebeli",
						},
					},
				},
				{
					Name:        "Пицца, бургеры & Царская шаурма",
					Slug:        "food-pizza-burgers",
					Description: "Сырная неаполитанская пицца, трюфельные бургеры Black Angus и шаурма на углях",
					Products: []productTemplate{
						{
							Name:        "Пицца 4 сыра с медом и грецким орехом 33см",
							Description: "Моцарелла, Дорблю с благородной плесенью, Пармезан и сливочный сыр Фонтина на тонком тесте.",
							PriceRUB:    790,
							ImageSeed:   "food-pizza-four-cheese",
						},
						{
							Name:        "Пицца «Пепперони Двойной удар» 33см",
							Description: "Пикантная острая колбаска пепперони, томатный соус San Marzano и тягучая моцарелла.",
							PriceRUB:    690,
							ImageSeed:   "food-pizza-pepperoni",
						},
						{
							Name:        "Бургер Black Angus Truffle с беконом",
							Description: "Сочная котлета из мраморной говядины, трюфельный соус, хрустящий бекон и булочка бриошь.",
							PriceRUB:    650,
							ImageSeed:   "food-burger-black-angus",
						},
						{
							Name:        "Царская шаурма на углях с сыром (450г)",
							Description: "Огромная сытная шаурма в хрустящем лаваше с двойным мясом цыпленка и чесночным соусом.",
							PriceRUB:    420,
							ImageSeed:   "food-royal-shawarma",
						},
						{
							Name:        "Бургер Двойной Чиз Smash с луком фри",
							Description: "Две поджаристые тонкие котлеты, двойной чеддер и соус BBQ на пышной картофельной булке.",
							PriceRUB:    590,
							ImageSeed:   "food-burger-smash-cheese",
						},
						{
							Name:        "Кесадилья с цыпленком и сырным соусом",
							Description: "Подрумяненная пшеничная тортилья с начинкой из сочного филе, сладкого перца и моцареллы.",
							PriceRUB:    480,
							ImageSeed:   "food-quesadilla-chicken",
						},
						{
							Name:        "Картофель фри по-деревенски с розмарином",
							Description: "Хрустящие картофельные дольки с золотистой корочкой и паприкой.",
							PriceRUB:    320,
							ImageSeed:   "food-fries-country",
						},
						{
							Name:        "Сырные палочки моцарелла с брусничным соусом",
							Description: "Тянущийся расплавленный сыр в хрустящей панировке панко (6 штук).",
							PriceRUB:    380,
							ImageSeed:   "food-mozzarella-sticks",
						},
					},
				},
				{
					Name:        "Роллы Филадельфия VIP & WOK",
					Slug:        "food-sushi-wok",
					Description: "Свежий атлантический лосось, японские роллы и горячая лапша WOK с морепродуктами",
					Products: []productTemplate{
						{
							Name:        "Роллы Филадельфия VIP с лососем (8 шт)",
							Description: "Щедрый пласт свежайшего атлантического лосося, сливочный сыр Cremette и спелый авокадо.",
							PriceRUB:    790,
							ImageSeed:   "food-sushi-philadelphia-vip",
						},
						{
							Name:        "Запеченные роллы с угрём и сырной шапочкой",
							Description: "Копченый угорь, соус Унаги, белый кунжут и запеченный нежный сырный топпинг (8 шт).",
							PriceRUB:    690,
							ImageSeed:   "food-sushi-baked-eel",
						},
						{
							Name:        "Роллы Калифорния с камчатским крабом",
							Description: "Настоящее мясо краба, огурец, японский майонез и икра летучей рыбы тобико (8 шт).",
							PriceRUB:    850,
							ImageSeed:   "food-sushi-california-crab",
						},
						{
							Name:        "WOK лапша Удон с креветками в соусе Терияки",
							Description: "Пшеничная лапша, тигровые креветки, хрустящие овощи, ростки сои и посыпка кунжутом.",
							PriceRUB:    590,
							ImageSeed:   "food-wok-udon-shrimp",
						},
						{
							Name:        "WOK рис Тямхан с курицей в устричном соусе",
							Description: "Обжаренный на раскаленном воке рис с нежным куриным бедром, яйцом и зеленым луком.",
							PriceRUB:    490,
							ImageSeed:   "food-wok-rice-chicken",
						},
						{
							Name:        "Суп Том Ям с морепродуктами и кокосовым молоком",
							Description: "Кисло-острый тайский суп с креветками, кальмарами, грибами цаогу и порцией риса жасмин.",
							PriceRUB:    650,
							ImageSeed:   "food-soup-tom-yam",
						},
						{
							Name:        "Поке с тунцом, бобами эдамаме и чукой",
							Description: "Освежающий гавайский боул с кубиками свежего тунца, соусом понзу и водорослями нори.",
							PriceRUB:    620,
							ImageSeed:   "food-poke-tuna-bowl",
						},
						{
							Name:        "Спринг-роллы с овощами и сладким чили (4 шт)",
							Description: "Хрустящее рисовое тесто с начинкой из сочной моркови, пекинской капусты и грибов шиитаке.",
							PriceRUB:    350,
							ImageSeed:   "food-spring-rolls",
						},
					},
				},
				{
					Name:        "Дофаминовые комбо-наборы & Сеты",
					Slug:        "food-combos-sets",
					Description: "Сытные комбо для программистов, большие сеты роллов и шашлычные пиры на компанию",
					Products: []productTemplate{
						{
							Name:        "Комбо-сет «Сытый Разработчик XL»",
							Description: "Бургер Black Angus, порция картофеля фри, сырные палочки, чесночный соус и напиток 0.5л.",
							PriceRUB:    1290,
							ImageSeed:   "food-combo-dev-xl",
						},
						{
							Name:        "Сет роллов «Дофаминовый взрыв 32 шт»",
							Description: "Филадельфия VIP, Запеченный угорь, Калифорния с крабом и Темпура ролл с лососем.",
							PriceRUB:    1890,
							ImageSeed:   "food-set-dofamine-rolls-32",
						},
						{
							Name:        "Шашлычный мясной пир на компанию (1.2 кг)",
							Description: "Шашлык из шеи, куриные крылышки гриль, люля-кебаб из баранины, овощи гриль и лаваш.",
							PriceRUB:    1890,
							ImageSeed:   "food-bbq-feast-combo",
						},
						{
							Name:        "Сет закусок к крафту «Пивной Гурман»",
							Description: "Острые крылышки Buffalo, кольца кальмара, чесночные гренки бородинские и чипсы начос.",
							PriceRUB:    990,
							ImageSeed:   "food-beer-snacks-set",
						},
						{
							Name:        "Комбо «Итальянский вечер на двоих»",
							Description: "Пицца 4 сыра, паста Карбонара, два десерта Тирамису и натуральный ягодный морс.",
							PriceRUB:    1490,
							ImageSeed:   "food-combo-italian-duet",
						},
						{
							Name:        "Азиатский комбо-ланч «Токио Дрифт»",
							Description: "Суп Том Ям с морепродуктами, мини-ролл с лососем, WOK с цыпленком и зеленый жасминовый чай.",
							PriceRUB:    790,
							ImageSeed:   "food-combo-tokyo-drift",
						},
						{
							Name:        "Десертный сет «Сладкий Релиз» (4 шт)",
							Description: "Чизкейк Нью-Йорк, фисташковый рулет, шоколадный фондан и эклер с кремом маскарпоне.",
							PriceRUB:    690,
							ImageSeed:   "food-set-sweet-release",
						},
						{
							Name:        "Детский комбо-бокс «Юный Кодер» с игрушкой",
							Description: "Хрустящие куриные наггетсы, картофельные смайлики, яблочный сок и коллекционная фигурка робота.",
							PriceRUB:    490,
							ImageSeed:   "food-kids-coder-box",
						},
					},
				},
			},
		},
	}

	totalCategories := 0
	totalProducts := 0

	now := time.Now().UTC()
	catIdx := 0

	for _, super := range superCategories {
		for _, sub := range super.Subcategories {
			catIdx++
			catName := fmt.Sprintf("%s %s", super.Icon, sub.Name)

			// Детерминированный UUID категории (ADR-012)
			catID := uuid.NewSHA1(uuid.NameSpaceDNS, []byte(fmt.Sprintf("category-%d-%s", catIdx, sub.Slug)))
			cat := domain.NewCategory(catID, catName, sub.Slug, sub.Description, now)

			if err := repo.InsertCategory(ctx, cat); err != nil {
				return fmt.Errorf("inserting category %q: %w", catName, err)
			}
			totalCategories++

			for prodIdx, pt := range sub.Products {
				// Детерминированный UUID товара (ADR-012)
				prodID := uuid.NewSHA1(uuid.NameSpaceDNS, []byte(fmt.Sprintf("product-%s-%d-%s", sub.Slug, prodIdx, pt.Name)))

				imageSeed := pt.ImageSeed
				if imageSeed == "" {
					imageSeed = fmt.Sprintf("prod-%s-%d", sub.Slug, prodIdx+1)
				}

				prod := domain.NewProduct(
					prodID,
					catID,
					catName,
					pt.Name,
					pt.Description,
					decimal.NewFromInt(pt.PriceRUB),
					imageSeed,
					now,
				)

				if err := repo.InsertProduct(ctx, prod); err != nil {
					return fmt.Errorf("inserting product %q: %w", pt.Name, err)
				}
				totalProducts++
			}
		}
	}

	log.Printf("seeded %d categories and %d products successfully across %d super-categories", totalCategories, totalProducts, len(superCategories))
	return nil
}
