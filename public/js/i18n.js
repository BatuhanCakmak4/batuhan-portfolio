/* Language switcher. English lives in the HTML; Turkish and German come from the tables below.
   boot.js picks the starting language (saved choice, then browser language) and sets <html lang>. */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var LANGS = ["en", "tr", "de"];
  var rm = matchMedia("(prefers-reduced-motion: reduce)");

  /* [English, Türkçe, Deutsch]. null keeps the English text. */
  var STR = [
    // Head, navigation, shared UI
    ["Batuhan Çakmak – Computer Engineering Student", "Batuhan Çakmak – Bilgisayar Mühendisliği Öğrencisi", "Batuhan Çakmak – Student der Technischen Informatik"],
    ["Batuhan Çakmak is a fourth-year Computer Engineering student at Kadir Has University working on computer networks, cybersecurity foundations, IoT and software projects.", "Batuhan Çakmak, Kadir Has Üniversitesi'nde bilgisayar ağları, siber güvenliğin temelleri, IoT ve yazılım projeleri üzerinde çalışan dördüncü sınıf Bilgisayar Mühendisliği öğrencisidir.", "Batuhan Çakmak studiert im vierten Jahr Technische Informatik an der Kadir-Has-Universität und arbeitet an Computernetzwerken, Grundlagen der Cybersecurity, IoT- und Softwareprojekten."],
    ["Skip to content", "İçeriğe geç", "Zum Inhalt springen"],
    ["Batuhan Çakmak, back to top", "Batuhan Çakmak, başa dön", "Batuhan Çakmak, nach oben"],
    ["Sections", "Bölümler", "Abschnitte"],
    ["Sections, mobile", "Bölümler, mobil", "Abschnitte, mobil"],
    ["Language", "Dil", "Sprache"],
    ["Open menu", "Menüyü aç", "Menü öffnen"],
    ["Close menu", "Menüyü kapat", "Menü schließen"],
    ["About", "Hakkımda", "Über mich"],
    ["Experience", "Deneyim", "Erfahrung"],
    ["Education", "Eğitim", "Ausbildung"],
    ["Projects", "Projeler", "Projekte"],
    ["Contact", "İletişim", "Kontakt"],
    ["Download CV", "CV'yi indir", "Lebenslauf herunterladen"],
    ["View larger:", "Büyüt:", "Vergrößern:"],
    ["Image viewer", "Görsel görüntüleyici", "Bildbetrachter"],
    ["Close image", "Görseli kapat", "Bild schließen"],
    ["Repository", "Repo", null],

    // Hero
    ["Computer Engineering Student · Kadir Has University", "Bilgisayar Mühendisliği Öğrencisi · Kadir Has Üniversitesi", "Student der Technischen Informatik · Kadir-Has-Universität"],
    ["Right now I’m learning", "Şu sıralar öğreniyorum:", "Gerade lerne ich"],
    ["computer networks", "bilgisayar ağları", "Computernetzwerke"],
    ["cybersecurity", "siber güvenlik", "Cybersecurity"],
    ["German", "Almanca", "Deutsch"],
    ["by building projects", "proje geliştirerek", "durch eigene Projekte"],
    ["Fourth-year student in Istanbul. I learn a topic, then build something with it: network labs on real switches, small IoT devices and web software.", "İstanbul'da dördüncü sınıf öğrencisiyim. Bir konuyu öğreniyor, ardından onunla bir şey inşa ediyorum: gerçek switch'ler üzerinde ağ laboratuvarları, küçük IoT cihazları ve web yazılımları.", "Student im vierten Jahr in Istanbul. Ich lerne ein Thema und baue dann etwas damit: Netzwerklabore mit echten Switches, kleine IoT-Geräte und Websoftware."],
    ["View projects", "Projeleri gör", "Projekte ansehen"],
    ["Istanbul, Türkiye", "İstanbul, Türkiye", "Istanbul, Türkei"],
    ["Erasmus+ · Germany 2026", "Erasmus+ · Almanya 2026", "Erasmus+ · Deutschland 2026"],
    ["Turkish · English · German", "Türkçe · İngilizce · Almanca", "Türkisch · Englisch · Deutsch"],
    ["Portrait of Batuhan Çakmak", "Batuhan Çakmak'ın portresi", "Porträt von Batuhan Çakmak"],
    ["Currently", "Şu anda", "Aktuell"],
    ["Learning German", "Almanca öğreniyorum", "Lerne Deutsch"],
    ["Learning computer networks", "Bilgisayar ağları öğreniyorum", "Lerne Computernetzwerke"],
    ["Building projects", "Projeler geliştiriyorum", "Baue Projekte"],
    ["Into cybersecurity", "Siber güvenlik meraklısı", "Begeistert von Cybersecurity"],
    ["Areas of focus", "Odak alanları", "Schwerpunkte"],
    ["Computer Networks", "Bilgisayar Ağları", "Computernetzwerke"],
    ["Cybersecurity", "Siber Güvenlik", null],
    ["Software Development", "Yazılım Geliştirme", "Softwareentwicklung"],
    ["Embedded Systems", "Gömülü Sistemler", "Eingebettete Systeme"],
    ["Infrastructure", "Altyapı", "Infrastruktur"],

    // About
    ["I’m learning networks by building them, and I want to understand how to keep them secure.", "Ağları kurarak öğreniyorum ve onları nasıl güvende tutacağımı anlamak istiyorum.", "Ich lerne Netzwerke, indem ich sie aufbaue, und ich will verstehen, wie man sie sicher hält."],
    ["I study Computer Engineering at Kadir Has University in Istanbul. Right now I’m going deep into computer networks: I learn a topic, then build something with it, from a Cisco design in Packet Tracer to a working lab with real switches and servers.", "İstanbul'daki Kadir Has Üniversitesi'nde Bilgisayar Mühendisliği okuyorum. Şu sıralar bilgisayar ağlarına derinlemesine odaklanıyorum: bir konuyu öğreniyor, sonra onunla bir şey inşa ediyorum; Packet Tracer'daki bir Cisco tasarımından gerçek switch ve sunuculardan oluşan çalışan bir laboratuvara kadar.", "Ich studiere Technische Informatik an der Kadir-Has-Universität in Istanbul. Im Moment vertiefe ich mich in Computernetzwerke: Ich lerne ein Thema und baue dann etwas damit, von einem Cisco-Design in Packet Tracer bis zu einem funktionierenden Labor mit echten Switches und Servern."],
    ["I spent March to September 2026 on an Erasmus+ exchange at Hochschule Ravensburg-Weingarten, studying Computer Science (Informatik) and taking German courses. I work comfortably in English and I’m learning German.", "Mart–Eylül 2026 arasında Erasmus+ değişim programıyla Hochschule Ravensburg-Weingarten'da Bilgisayar Bilimleri (Informatik) okudum ve Almanca kurslarına katıldım. İngilizceyi rahatlıkla kullanıyorum ve Almanca öğreniyorum.", "Von März bis September 2026 war ich mit Erasmus+ an der Hochschule Ravensburg-Weingarten, habe Informatik studiert und Deutschkurse besucht. Auf Englisch arbeite ich sicher, Deutsch lerne ich gerade."],
    ["Cybersecurity is the area I’m most curious about, and networking and cybersecurity are the directions I’d like to build a career in. I also enjoy software, web development and small embedded projects, so I keep moving between code, networks and devices.", "En çok merak ettiğim alan siber güvenlik; kariyerimi ağ ve siber güvenlik yönünde inşa etmek istiyorum. Yazılımdan, web geliştirmeden ve küçük gömülü projelerden de keyif alıyorum, bu yüzden kod, ağlar ve cihazlar arasında gidip geliyorum.", "Cybersecurity ist das Gebiet, das mich am meisten interessiert, und in Netzwerken und Cybersecurity möchte ich meine Karriere aufbauen. Ich mag auch Software, Webentwicklung und kleine Embedded-Projekte, deshalb bewege ich mich ständig zwischen Code, Netzwerken und Geräten."],
    ["Learning now", "Şu an öğrendiklerim", "Lerne gerade"],
    ["Computer networks, German", "Bilgisayar ağları, Almanca", "Computernetzwerke, Deutsch"],
    ["Building", "Geliştirdiklerim", "Baue"],
    ["Network labs, IoT and web projects", "Ağ laboratuvarları, IoT ve web projeleri", "Netzwerklabore, IoT- und Webprojekte"],
    ["Curious about", "Merak ettiğim", "Interessiert an"],
    ["Languages", "Diller", "Sprachen"],
    ["Turkish (native), English (fluent), German (A2)", "Türkçe (ana dil), İngilizce (akıcı), Almanca (A2)", "Türkisch (Muttersprache), Englisch (fließend), Deutsch (A2)"],
    ["Studying", "Okuduğum bölüm", "Studium"],
    ["Computer Engineering, Kadir Has University", "Bilgisayar Mühendisliği, Kadir Has Üniversitesi", "Technische Informatik, Kadir-Has-Universität"],
    ["Exchange", "Değişim", "Austausch"],
    ["Erasmus+, Ravensburg-Weingarten, Germany", "Erasmus+, Ravensburg-Weingarten, Almanya", "Erasmus+, Ravensburg-Weingarten, Deutschland"],
    ["Interned at", "Staj yaptığım yerler", "Praktika bei"],
    ["Yarış Kabin and SAPENTA", "Yarış Kabin ve SAPENTA", "Yarış Kabin und SAPENTA"],
    ["Based in", "Konum", "Wohnort"],

    // Toolkit
    ["Toolkit", "Araçlar", "Werkzeuge"],
    ["What I work with", "Kullandığım teknolojiler", "Womit ich arbeite"],
    ["Networks", "Ağlar", "Netzwerke"],
    ["Routing", "Yönlendirme", null],
    ["Switching", "Anahtarlama", null],
    ["Used in", "Kullanıldığı yerler", "Eingesetzt in"],
    ["Software", "Yazılım", null],
    ["SQL via MySQL", "MySQL ile SQL", "SQL über MySQL"],
    ["Systems & IoT", "Sistemler & IoT", "Systeme & IoT"],
    ["dashboard UI", "panel arayüzü", "Dashboard-UI"],

    // Experience
    ["Two internships, each one a different side of the same field.", "İki staj; her biri aynı alanın farklı bir yüzü.", "Zwei Praktika, jedes eine andere Seite desselben Fachgebiets."],
    ["September 2026", "Eylül 2026", null],
    ["IT, Software & Web Development Intern", "BT, Yazılım ve Web Geliştirme Stajyeri", "Praktikant IT, Software & Webentwicklung"],
    ["Configured and tested network environments with Cisco technologies", "Cisco teknolojileriyle ağ ortamlarını yapılandırdım ve test ettim", "Netzwerkumgebungen mit Cisco-Technologien konfiguriert und getestet"],
    ["Worked with switches, access points, VLANs and network troubleshooting", "Switch'ler, erişim noktaları, VLAN'lar ve ağ sorun giderme üzerinde çalıştım", "Mit Switches, Access Points, VLANs und Netzwerk-Fehlersuche gearbeitet"],
    ["Supported IT infrastructure and hardware configuration tasks", "BT altyapısı ve donanım yapılandırma işlerine destek verdim", "IT-Infrastruktur und Hardwarekonfiguration unterstützt"],
    ["Contributed to web development and website maintenance", "Web geliştirme ve web sitesi bakımına katkıda bulundum", "An Webentwicklung und Website-Pflege mitgewirkt"],
    ["Worked with Raspberry Pi and embedded/IoT technologies", "Raspberry Pi ve gömülü/IoT teknolojileriyle çalıştım", "Mit Raspberry Pi und Embedded-/IoT-Technologien gearbeitet"],
    ["What I learned", "Öğrendiklerim", "Was ich gelernt habe"],
    ["Hands-on practice with real switches, access points and VLANs, and how network problems are found and fixed on real equipment. It also showed me how infrastructure, web work and embedded devices come together inside one company.", "Gerçek switch'ler, erişim noktaları ve VLAN'larla uygulamalı deneyim ve ağ sorunlarının gerçek ekipman üzerinde nasıl bulunup çözüldüğü. Ayrıca altyapının, web işlerinin ve gömülü cihazların bir şirket içinde nasıl bir araya geldiğini gösterdi.", "Praxis mit echten Switches, Access Points und VLANs, und wie Netzwerkprobleme an echter Hardware gefunden und behoben werden. Außerdem habe ich gesehen, wie Infrastruktur, Webarbeit und Embedded-Geräte in einem Unternehmen zusammenspielen."],
    ["June to July 2025", "Haziran – Temmuz 2025", "Juni bis Juli 2025"],
    ["Software Developer Intern", "Yazılım Geliştirici Stajyeri", "Praktikant Softwareentwicklung"],
    ["Istanbul", "İstanbul", null],
    ["Developed and maintained basic applications using SAP ABAP", "SAP ABAP ile temel uygulamalar geliştirdim ve bakımını yaptım", "Einfache Anwendungen mit SAP ABAP entwickelt und gepflegt"],
    ["Worked on ABAP programming, debugging and data processing in SAP environments", "SAP ortamlarında ABAP programlama, hata ayıklama ve veri işleme üzerinde çalıştım", "ABAP-Programmierung, Debugging und Datenverarbeitung in SAP-Umgebungen"],
    ["Gained hands-on experience with SAP enterprise systems, business processes and software development workflows", "SAP kurumsal sistemleri, iş süreçleri ve yazılım geliştirme iş akışlarında uygulamalı deneyim kazandım", "Praxiserfahrung mit SAP-Unternehmenssystemen, Geschäftsprozessen und Entwicklungs-Workflows gesammelt"],
    ["How enterprise software is written and debugged inside SAP environments, and how it connects to business processes and everyday development workflows.", "Kurumsal yazılımın SAP ortamlarında nasıl yazılıp hata ayıklandığı ve iş süreçleriyle, günlük geliştirme akışlarıyla nasıl bağlantı kurduğu.", "Wie Unternehmenssoftware in SAP-Umgebungen geschrieben und debuggt wird und wie sie mit Geschäftsprozessen und dem Entwicklungsalltag zusammenhängt."],

    // Education
    ["From Istanbul to Germany and back.", "İstanbul'dan Almanya'ya ve geri.", "Von Istanbul nach Deutschland und zurück."],
    ["Istanbul · 2022 to now", "İstanbul · 2022'den beri", "Istanbul · seit 2022"],
    ["Kadir Has University", "Kadir Has Üniversitesi", "Kadir-Has-Universität"],
    ["Bachelor of Science in Computer Engineering. Fourth-year student.", "Bilgisayar Mühendisliği lisans programı. Dördüncü sınıf öğrencisi.", "Bachelor of Science in Technischer Informatik. Student im vierten Jahr."],
    ["Coursework: Data Structures, Object-Oriented Programming, Computer Networks, Operating Systems, Database Systems, Web Technologies", "Dersler: Veri Yapıları, Nesne Yönelimli Programlama, Bilgisayar Ağları, İşletim Sistemleri, Veritabanı Sistemleri, Web Teknolojileri", "Lehrveranstaltungen: Datenstrukturen, Objektorientierte Programmierung, Computernetzwerke, Betriebssysteme, Datenbanksysteme, Webtechnologien"],
    ["Practical skills in C, C++, Java, Python and SQL through academic projects", "Akademik projelerle C, C++, Java, Python ve SQL'de pratik beceriler", "Praktische Kenntnisse in C, C++, Java, Python und SQL durch Studienprojekte"],
    ["Focus on networking, cybersecurity, software development and embedded systems", "Ağ, siber güvenlik, yazılım geliştirme ve gömülü sistemlere odaklanma", "Schwerpunkt auf Netzwerken, Cybersecurity, Softwareentwicklung und eingebetteten Systemen"],
    ["Germany · March to September 2026", "Almanya · Mart – Eylül 2026", "Deutschland · März bis September 2026"],
    ["Erasmus+ exchange in Informatik (Computer Science).", "Informatik (Bilgisayar Bilimleri) alanında Erasmus+ değişimi.", "Erasmus+-Austausch im Studiengang Informatik."],
    ["Python Programming, Internet Programming, Numerical Methods and Mathematics", "Python Programlama, İnternet Programlama, Sayısal Yöntemler ve Matematik", "Python-Programmierung, Internetprogrammierung, Numerische Methoden und Mathematik"],
    ["German language courses and basic German communication skills", "Almanca dil kursları ve temel Almanca iletişim becerileri", "Deutschkurse und grundlegende Kommunikation auf Deutsch"],
    ["Intercultural communication, teamwork and adaptability from studying and living in Germany", "Almanya'da okuyup yaşamanın kazandırdığı kültürlerarası iletişim, takım çalışması ve uyum yeteneği", "Interkulturelle Kommunikation, Teamarbeit und Anpassungsfähigkeit durch Studium und Leben in Deutschland"],
    ["Back to building", "Yeniden üretmeye", "Zurück ans Bauen"],
    ["Bringing the exchange year into the labs, projects and internships on this page.", "Değişim yılında edindiklerimi bu sayfadaki laboratuvarlara, projelere ve stajlara taşıyorum.", "Das Austauschjahr fließt in die Labore, Projekte und Praktika auf dieser Seite ein."],

    // Projects
    ["Things I built to practise what the sections above describe: networking, software and small devices.", "Yukarıdaki bölümlerde anlatılanları pratiğe dökmek için yaptığım işler: ağlar, yazılım ve küçük cihazlar.", "Dinge, die ich gebaut habe, um das Beschriebene zu üben: Netzwerke, Software und kleine Geräte."],
    ["Implemented on real hardware", "Gerçek donanımda uygulandı", "Auf echter Hardware umgesetzt"],
    ["Infrastructure, networking, Raspberry Pi", "Altyapı, ağ, Raspberry Pi", "Infrastruktur, Netzwerke, Raspberry Pi"],
    ["A physical enterprise-style network I built to move beyond simulation: a managed Layer 3 switch, three Raspberry Pi servers, hand-terminated cabling and real client devices.", "Simülasyonun ötesine geçmek için kurduğum kurumsal tarzda fiziksel bir ağ: yönetilebilir bir Layer 3 switch, üç Raspberry Pi sunucu, elle sonlandırılmış kablolama ve gerçek istemci cihazlar.", "Ein physisches Netzwerk im Unternehmensstil, mit dem ich über die Simulation hinausgehen wollte: ein managed Layer-3-Switch, drei Raspberry-Pi-Server, selbst konfektionierte Verkabelung und echte Client-Geräte."],
    ["Repository and configuration files", "Repo ve yapılandırma dosyaları", "Repository und Konfigurationsdateien"],
    ["The physical lab", "Fiziksel laboratuvar", "Das physische Labor"],
    ["Physical layer", "Fiziksel katman", "Bitübertragungsschicht"],
    ["Cables I prepared and tested myself.", "Kendi hazırlayıp test ettiğim kablolar.", "Kabel, die ich selbst vorbereitet und getestet habe."],
    ["UTP preparation, RJ45 termination, crimping and continuity tests came before any configuration.", "Herhangi bir yapılandırmadan önce UTP hazırlığı, RJ45 sonlandırma, sıkma ve süreklilik testleri geldi.", "UTP-Vorbereitung, RJ45-Terminierung, Crimpen und Durchgangstests kamen vor jeder Konfiguration."],
    ["Crimping tools", "Kablo sıkma aletleri", "Crimpwerkzeuge"],
    ["UTP wire preparation", "UTP kablo hazırlığı", "Vorbereitung der UTP-Adern"],
    ["Cable test result", "Kablo test sonucu", "Ergebnis des Kabeltests"],
    ["Testing workstation", "Test çalışma alanı", "Testarbeitsplatz"],
    ["Network layer", "Ağ katmanı", "Vermittlungsschicht"],
    ["One switch, three VLANs, routed internally.", "Bir switch, üç VLAN, dahili yönlendirme.", "Ein Switch, drei VLANs, intern geroutet."],
    ["The Aruba 2930F JL256A routes between Clients, Management and Servers. DHCP relay carries client requests across the VLAN boundary.", "Aruba 2930F JL256A; İstemciler, Yönetim ve Sunucular arasında yönlendirme yapar. DHCP relay, istemci isteklerini VLAN sınırının ötesine taşır.", "Der Aruba 2930F JL256A routet zwischen Clients, Management und Servern. DHCP-Relay leitet Client-Anfragen über die VLAN-Grenze weiter."],
    ["Windows client in VLAN 10 connects to the Aruba 2930F, which connects to DHCP, DNS and web Raspberry Pi servers in VLAN 100. Management MacBook in VLAN 99. Planned wireless AP and gateway are dashed.", "VLAN 10'daki Windows istemci Aruba 2930F'ye bağlanır; switch de VLAN 100'deki DHCP, DNS ve web Raspberry Pi sunucularına bağlıdır. Yönetim MacBook'u VLAN 99'dadır. Planlanan kablosuz AP ve ağ geçidi kesikli çizgiyle gösterilir.", "Der Windows-Client in VLAN 10 ist mit dem Aruba 2930F verbunden, der wiederum mit den DHCP-, DNS- und Web-Servern (Raspberry Pi) in VLAN 100 verbunden ist. Das Management-MacBook ist in VLAN 99. Geplanter WLAN-AP und Gateway sind gestrichelt."],
    ["VLAN 10 · Clients", "VLAN 10 · İstemciler", null],
    ["VLAN 100 · Servers", "VLAN 100 · Sunucular", "VLAN 100 · Server"],
    ["Windows client", "Windows istemci", "Windows-Client"],
    ["DHCP lease", "DHCP kirası", "DHCP-Lease"],
    ["MacBook workstation", "MacBook iş istasyonu", "MacBook-Arbeitsplatz"],
    ["Roadmap", "Yol haritası", "Geplant"],
    ["Gateway · NAT · firewall", null, "Gateway · NAT · Firewall"],
    ["Packet journey", "Paketin yolculuğu", "Weg des Pakets"],
    ["Switch VLAN overview", "Switch VLAN görünümü", "VLAN-Übersicht am Switch"],
    ["Layer 3 routing on the switch", "Switch üzerinde Layer 3 yönlendirme", "Layer-3-Routing auf dem Switch"],
    ["Services", "Servisler", "Dienste"],
    ["DHCP, DNS and a web server on Raspberry Pi.", "Raspberry Pi üzerinde DHCP, DNS ve bir web sunucusu.", "DHCP, DNS und ein Webserver auf dem Raspberry Pi."],
    ["Internal dashboard", "Dahili panel", "Internes Dashboard"],
    ["DHCP lease process", "DHCP kiralama süreci", "DHCP-Lease-Vorgang"],
    ["DNS query", "DNS sorgusu", "DNS-Abfrage"],
    ["Nginx service", "Nginx servisi", "Nginx-Dienst"],
    ["Validation", "Doğrulama", "Validierung"],
    ["Tested from real devices.", "Gerçek cihazlardan test edildi.", "Mit echten Geräten getestet."],
    ["A Windows laptop on VLAN 10 received 192.168.10.50 through DHCP relay. A MacBook administered the switch from the management VLAN.", "VLAN 10'daki bir Windows dizüstü bilgisayar DHCP relay üzerinden 192.168.10.50 adresini aldı. Bir MacBook, switch'i yönetim VLAN'ından yönetti.", "Ein Windows-Laptop in VLAN 10 erhielt über DHCP-Relay die Adresse 192.168.10.50. Ein MacBook verwaltete den Switch aus dem Management-VLAN."],
    ["Windows lease", "Windows IP kirası", "Windows-Lease"],
    ["Name resolution", "Ad çözümleme", "Namensauflösung"],
    ["Management network", "Yönetim ağı", "Managementnetz"],
    ["Implemented", "Uygulananlar", "Umgesetzt"],
    ["VLAN 10 Clients, 99 Management, 100 Servers", "VLAN 10 İstemciler, 99 Yönetim, 100 Sunucular", "VLAN 10 Clients, 99 Management, 100 Server"],
    ["Layer 3 routing on the Aruba 2930F", "Aruba 2930F üzerinde Layer 3 yönlendirme", "Layer-3-Routing auf dem Aruba 2930F"],
    ["ISC DHCP with DHCP relay", "DHCP relay ile ISC DHCP", "ISC DHCP mit DHCP-Relay"],
    ["BIND9 internal DNS and Nginx web server", "BIND9 dahili DNS ve Nginx web sunucusu", "Internes DNS mit BIND9 und Nginx-Webserver"],
    ["Static server addressing, dynamic client addressing", "Sunucular için statik, istemciler için dinamik adresleme", "Statische Adressen für Server, dynamische für Clients"],
    ["Windows DHCP validation, configuration backups", "Windows DHCP doğrulaması, yapılandırma yedekleri", "DHCP-Test mit Windows, Konfigurationsbackups"],
    ["Roadmap, not built yet", "Yol haritası, henüz yapılmadı", "Roadmap, noch nicht gebaut"],
    ["VLAN 20 wireless and Aruba access point", "VLAN 20 kablosuz ağ ve Aruba erişim noktası", "VLAN 20 WLAN und Aruba Access Point"],
    ["Internet gateway, NAT/PAT", "İnternet ağ geçidi, NAT/PAT", "Internet-Gateway, NAT/PAT"],
    ["Firewall and ACLs", "Güvenlik duvarı ve ACL'ler", "Firewall und ACLs"],
    ["Monitoring and logging", "İzleme ve loglama", "Monitoring und Logging"],
    ["Work in progress", "Geliştirme aşamasında", "In Arbeit"],
    ["Full-stack, IoT, embedded systems", "Full-stack, IoT, gömülü sistemler", "Full-Stack, IoT, eingebettete Systeme"],
    ["Where a web application meets a sensor.", "Bir web uygulamasının bir sensörle buluştuğu yer.", "Wo eine Webanwendung auf einen Sensor trifft."],
    ["Repository and demo videos", "Repo ve demo videoları", "Repository und Demovideos"],
    ["Data flow", "Veri akışı", "Datenfluss"],
    ["Web application", "Web uygulaması", "Webanwendung"],
    ["Serial port", "Seri port", "Serielle Schnittstelle"],
    ["Temperature / humidity sensor", "Sıcaklık / nem sensörü", "Temperatur-/Feuchtigkeitssensor"],
    ["Control Center", "Kontrol Merkezi", null],
    ["Arduino prototype", "Arduino prototipi", "Arduino-Prototyp"],
    ["Login", "Giriş", "Anmeldung"],
    ["Calendar", "Takvim", "Kalender"],
    ["Node.js, Express, MySQL, express-session, bcryptjs, SerialPort, Arduino, dotenv. Still in development, not a finished product.", "Node.js, Express, MySQL, express-session, bcryptjs, SerialPort, Arduino, dotenv. Hâlâ geliştiriliyor, bitmiş bir ürün değil.", "Node.js, Express, MySQL, express-session, bcryptjs, SerialPort, Arduino, dotenv. Noch in Entwicklung, kein fertiges Produkt."],
    ["Configured and documented", "Yapılandırıldı ve belgelendi", "Konfiguriert und dokumentiert"],
    ["Networking, Cisco, Packet Tracer", "Ağ, Cisco, Packet Tracer", "Netzwerke, Cisco, Packet Tracer"],
    ["A simulated company split into IT, Human Resources, Finance and Sales, with Cisco 2911 routers and 2960 switches. The repository includes the exported router and switch configurations, so the design is documented and not only drawn.", "BT, İnsan Kaynakları, Finans ve Satış birimlerine ayrılmış, Cisco 2911 router'lar ve 2960 switch'lerle kurulmuş simüle bir şirket. Repoda dışa aktarılmış router ve switch yapılandırmaları da var; yani tasarım sadece çizilmiş değil, belgelenmiş.", "Ein simuliertes Unternehmen mit den Abteilungen IT, Personal, Finanzen und Vertrieb, aufgebaut mit Cisco-2911-Routern und 2960-Switches. Das Repository enthält die exportierten Router- und Switch-Konfigurationen, das Design ist also dokumentiert und nicht nur gezeichnet."],
    ["Repository and exported configurations", "Repo ve dışa aktarılmış yapılandırmalar", "Repository und exportierte Konfigurationen"],
    ["Network topology", "Ağ topolojisi", "Netzwerktopologie"],
    ["Packet Tracer network topology with IT, HR, Finance and Sales departments", "BT, İK, Finans ve Satış departmanlarını içeren Packet Tracer ağ topolojisi", "Packet-Tracer-Netzwerktopologie mit den Abteilungen IT, Personal, Finanzen und Vertrieb"],
    ["IPv4 addressing and subnetting for each department", "Her departman için IPv4 adresleme ve alt ağlara bölme", "IPv4-Adressierung und Subnetting für jede Abteilung"],
    ["VLAN segmentation, 802.1Q trunking, PVST", "VLAN segmentasyonu, 802.1Q trunking, PVST", "VLAN-Segmentierung, 802.1Q-Trunking, PVST"],
    ["Router-on-a-stick inter-VLAN routing", "Router-on-a-stick ile VLAN'lar arası yönlendirme", "Inter-VLAN-Routing per Router-on-a-Stick"],
    ["Centralized DHCP with relay, and DNS", "Relay ile merkezi DHCP ve DNS", "Zentrales DHCP mit Relay sowie DNS"],
    ["Management VLANs, SSH, wireless networking", "Yönetim VLAN'ları, SSH, kablosuz ağ", "Management-VLANs, SSH, WLAN"],
    ["Planned, not implemented", "Planlandı, uygulanmadı", "Geplant, nicht umgesetzt"],
    ["Extended ACLs, broader SSH management", "Genişletilmiş ACL'ler, daha kapsamlı SSH yönetimi", "Erweiterte ACLs, umfassenderes SSH-Management"],
    ["Port security, DHCP snooping", "Port güvenliği, DHCP snooping", "Port Security, DHCP Snooping"],
    ["Firewall integration, NAT, simulated Internet", "Güvenlik duvarı entegrasyonu, NAT, simüle İnternet", "Firewall-Integration, NAT, simuliertes Internet"],
    ["Syslog, NTP, monitoring", "Syslog, NTP, izleme", "Syslog, NTP, Monitoring"],
    ["In development", "Geliştiriliyor", "In Entwicklung"],
    ["Raspberry Pi, APIs", "Raspberry Pi, API'ler", null],
    ["A Flask dashboard for a Raspberry Pi mirror. Mock and raspberrypi modes let me build and test away from the device.", "Raspberry Pi tabanlı bir ayna için Flask paneli. Mock ve raspberrypi modları sayesinde cihazdan uzakta da geliştirip test edebiliyorum.", "Ein Flask-Dashboard für einen Raspberry-Pi-Spiegel. Mit den Modi mock und raspberrypi kann ich auch ohne das Gerät entwickeln und testen."],
    ["Open-Meteo, Spotify Web API and iCloud CalDAV feed a Flask server that serves the dashboard", "Open-Meteo, Spotify Web API ve iCloud CalDAV, paneli sunan bir Flask sunucusunu besler", "Open-Meteo, Spotify Web API und iCloud CalDAV liefern Daten an einen Flask-Server, der das Dashboard ausliefert"],
    ["Flask on Raspberry Pi", "Raspberry Pi'da Flask", "Flask auf Raspberry Pi"],
    ["Dashboard, clock and greeting with mock data", "Örnek verilerle panel, saat ve karşılama", "Dashboard, Uhr und Begrüßung mit Mock-Daten"],
    ["Weather with caching and offline fallback", "Önbellekli ve çevrimdışı yedekli hava durumu", "Wetter mit Caching und Offline-Fallback"],
    ["Spotify Now Playing", "Spotify'da şu an çalan", null],
    ["Apple/iCloud Calendar over CalDAV", "CalDAV üzerinden Apple/iCloud Takvim", "Apple-/iCloud-Kalender über CalDAV"],
    ["The repository has no screenshots yet, so none are shown.", "Repoda henüz ekran görüntüsü yok, bu yüzden burada da gösterilmiyor.", "Das Repository hat noch keine Screenshots, deshalb werden hier keine gezeigt."],
    ["Rebuilt", "Yeniden yazıldı", "Neu gebaut"],
    ["A project that shows where I started and how far I have come.", "Nereden başladığımı ve ne kadar yol aldığımı gösteren bir proje.", "Ein Projekt, das zeigt, wo ich angefangen habe und wie weit ich gekommen bin."],
    ["Later", "Sonra", "Später"],
    ["My first-year university project: a terminal-based N-Queens program in C.", "Üniversite birinci sınıf projem: C ile yazılmış, terminal tabanlı bir N-Queens programı.", "Mein Projekt aus dem ersten Studienjahr: ein terminalbasiertes N-Queens-Programm in C."],
    ["Revisited and rebuilt as a graphical desktop game in C++ with SFML 2.6 and CMake: an 8×8 board, mouse placement, Easy and Hard modes, conflict detection and attacked-square display in Easy Mode.", "Sonradan ele alıp C++, SFML 2.6 ve CMake ile grafik arayüzlü bir masaüstü oyunu olarak yeniden yazdım: 8×8 tahta, fareyle yerleştirme, Kolay ve Zor modlar, çakışma tespiti ve Kolay Mod'da tehdit altındaki kareleri gösterme.", "Später überarbeitet und als grafisches Desktop-Spiel in C++ mit SFML 2.6 und CMake neu gebaut: 8×8-Brett, Platzierung per Maus, leichter und schwerer Modus, Konflikterkennung und Anzeige bedrohter Felder im leichten Modus."],
    ["Main window", "Ana pencere", "Hauptfenster"],
    ["Easy Mode", "Kolay Mod", "Leichter Modus"],
    ["Hard Mode", "Zor Mod", "Schwerer Modus"],
    ["Game settings", "Oyun ayarları", "Spieleinstellungen"],

    // Lab packet journey (built by main.js)
    ["Layer 3 routing", "Layer 3 yönlendirme", "Layer-3-Routing"],
    ["DHCP and DNS", "DHCP ve DNS", "DHCP und DNS"],
    ["Application", "Uygulama", "Anwendung"],
    ["Hand-terminated Ethernet runs connect the client, the Aruba switch and the Raspberry Pi servers.", "Elle sonlandırılmış Ethernet kabloları istemciyi, Aruba switch'i ve Raspberry Pi sunucularını birbirine bağlar.", "Selbst konfektionierte Ethernet-Kabel verbinden den Client, den Aruba-Switch und die Raspberry-Pi-Server."],
    ["The Windows client sits in VLAN 10. Servers are in VLAN 100 and management is in VLAN 99.", "Windows istemci VLAN 10'da. Sunucular VLAN 100'de, yönetim ise VLAN 99'da.", "Der Windows-Client liegt in VLAN 10. Die Server sind in VLAN 100, das Management in VLAN 99."],
    ["Servers use static addresses (192.168.100.10, .20, .30). Clients receive dynamic addresses.", "Sunucular statik adres kullanır (192.168.100.10, .20, .30). İstemciler dinamik adres alır.", "Server nutzen statische Adressen (192.168.100.10, .20, .30). Clients erhalten dynamische Adressen."],
    ["The Aruba 2930F routes between VLANs, so a VLAN 10 client can reach VLAN 100 servers.", "Aruba 2930F VLAN'lar arasında yönlendirme yapar; böylece VLAN 10'daki bir istemci VLAN 100'deki sunuculara ulaşabilir.", "Der Aruba 2930F routet zwischen den VLANs, sodass ein Client in VLAN 10 die Server in VLAN 100 erreicht."],
    ["The switch relays DHCP requests to the ISC DHCP server. BIND9 resolves names in lab.home.arpa.", "Switch, DHCP isteklerini ISC DHCP sunucusuna iletir. BIND9, lab.home.arpa içindeki adları çözümler.", "Der Switch leitet DHCP-Anfragen an den ISC-DHCP-Server weiter. BIND9 löst Namen in lab.home.arpa auf."],
    ["Nginx serves the internal dashboard, checked from real devices.", "Nginx dahili paneli sunar; gerçek cihazlardan kontrol edildi.", "Nginx liefert das interne Dashboard aus, geprüft von echten Geräten."],

    // GitHub
    ["The code behind the projects", "Projelerin arkasındaki kod", "Der Code hinter den Projekten"],
    ["Every project on this page has a public repository with its source, configuration files or demo material.", "Bu sayfadaki her projenin kaynak kodu, yapılandırma dosyaları veya demo materyallerini içeren herkese açık bir reposu var.", "Zu jedem Projekt auf dieser Seite gibt es ein öffentliches Repository mit Quellcode, Konfigurationsdateien oder Demomaterial."],
    ["All repositories, configurations and work in progress.", "Tüm repolar, yapılandırmalar ve devam eden çalışmalar.", "Alle Repositories, Konfigurationen und laufenden Arbeiten."],
    ["Open profile", "Profili aç", "Profil öffnen"],
    ["Enterprise Infrastructure Lab: VLANs, Layer 3 routing, DHCP relay, BIND9 and Nginx on real hardware.", "Enterprise Infrastructure Lab: gerçek donanımda VLAN'lar, Layer 3 yönlendirme, DHCP relay, BIND9 ve Nginx.", "Enterprise Infrastructure Lab: VLANs, Layer-3-Routing, DHCP-Relay, BIND9 und Nginx auf echter Hardware."],
    ["HAN37: a web application that reads an Arduino sensor over USB serial.", "HAN37: bir Arduino sensörünü USB seri bağlantı üzerinden okuyan web uygulaması.", "HAN37: eine Webanwendung, die einen Arduino-Sensor über USB-Seriell ausliest."],
    ["Enterprise Network Design with exported router and switch configurations.", "Dışa aktarılmış router ve switch yapılandırmalarıyla Enterprise Network Design.", "Enterprise Network Design mit exportierten Router- und Switch-Konfigurationen."],
    ["Smart Mirror: a Flask dashboard with weather, Spotify and calendar.", "Smart Mirror: hava durumu, Spotify ve takvim içeren bir Flask paneli.", "Smart Mirror: ein Flask-Dashboard mit Wetter, Spotify und Kalender."],
    ["N-Queens: rebuilt from a C terminal program into a C++ desktop game.", "N-Queens: C terminal programından C++ masaüstü oyununa dönüştürüldü.", "N-Queens: vom C-Terminalprogramm zum C++-Desktopspiel neu gebaut."],

    // Contact, footer
    ["Still building.", "Hâlâ üretiyorum.", "Ich baue weiter."],
    ["Still learning.", "Hâlâ öğreniyorum.", "Ich lerne weiter."],
    ["Questions about a project, an internship or anything on this page: email is the fastest way to reach me.", "Bir proje, staj ya da bu sayfadaki herhangi bir şey hakkında sorunuz varsa bana en hızlı e-postayla ulaşabilirsiniz.", "Fragen zu einem Projekt, einem Praktikum oder etwas anderem auf dieser Seite? Per E-Mail erreichen Sie mich am schnellsten."],
    ["Email", "E-posta", "E-Mail"],
    ["Send an email", "E-posta gönder", "E-Mail senden"],
    ["Copy address", "Adresi kopyala", "Adresse kopieren"],
    ["Copied", "Kopyalandı", "Kopiert"],
    ["Email address copied", "E-posta adresi kopyalandı", "E-Mail-Adresse kopiert"],
    ["PDF download", "PDF indir", "PDF-Download"],
    ["Batuhan Çakmak · Istanbul, Türkiye", "Batuhan Çakmak · İstanbul, Türkiye", "Batuhan Çakmak · Istanbul, Türkei"],
    ["Back to top", "Başa dön", "Nach oben"]
  ];

  /* Blocks with inline markup, marked data-i18n-html="id" in the page: [Türkçe, Deutsch]. */
  var HTML = {
    "lab-services": [
      "ISC DHCP kablolu istemci kapsamına hizmet verir. BIND9 dahili <code>lab.home.arpa</code> bölgesine yanıt verir, Nginx ise <code>web.lab.home.arpa</code> adresinde özel bir panel barındırır.",
      "ISC DHCP versorgt den kabelgebundenen Client-Bereich. BIND9 ist für die interne Zone <code>lab.home.arpa</code> zuständig, und Nginx hostet ein eigenes Dashboard unter <code>web.lab.home.arpa</code>."
    ],
    "han37-flow": [
      "Kullanıcılar oturum tabanlı kimlik doğrulama ve bcrypt parola kontrolüyle giriş yapar; ardından Kontrol Merkezi'ne, takvime ve Smart Room modülüne ulaşır. Sunucu, Arduino'dan USB seri bağlantı üzerinden JSON okur, bunu <code>/api/sensor</code> adresinde sunar, bağlantı koparsa yeniden dener ve verileri MySQL'de saklar.",
      "Nutzer melden sich mit sessionbasierter Authentifizierung und bcrypt-Passwortprüfung an und gelangen dann zum Control Center, einem Kalender und dem Smart-Room-Modul. Der Server liest JSON vom Arduino über USB-Seriell, stellt es unter <code>/api/sensor</code> bereit, verbindet sich bei Abbruch neu und speichert die Daten in MySQL."
    ],
    "pt-static": [
      "Dört router arasında <b>statik yönlendirme</b>",
      "<b>Statisches Routing</b> zwischen den vier Routern"
    ]
  };

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  var map = {};
  STR.forEach(function (r) { map[norm(r[0])] = r; });

  var lang = LANGS.indexOf(root.lang) > -1 ? root.lang : "en";
  var subs = [];

  function t(en) {
    if (lang === "en") return en;
    var r = map[norm(en)];
    if (r) return r[LANGS.indexOf(lang)] || en;
    var m = /^View larger: (.+)$/.exec(en);
    if (m) return t("View larger:") + " " + t(m[1]);
    return en;
  }

  /* Snapshot the English page once. Containers that main.js fills at runtime carry data-i18n-skip. */
  var SKIP = "script, style, [data-i18n-skip], [data-i18n-html]";
  var texts = [], attrs = [], blocks = [];
  var walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      return map[norm(n.nodeValue)] && !n.parentNode.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  for (var n; (n = walker.nextNode());) {
    var v = n.nodeValue;
    texts.push({ node: n, en: v.trim(), lead: v.match(/^\s*/)[0], trail: v.match(/\s*$/)[0] });
  }
  d.querySelectorAll("[aria-label], [alt]").forEach(function (el) {
    if (el.closest("[data-i18n-skip]")) return;
    ["aria-label", "alt"].forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) attrs.push({ el: el, name: a, en: v });
    });
  });
  d.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    if (HTML[el.getAttribute("data-i18n-html")]) blocks.push({ el: el, en: el.innerHTML, tr: HTML[el.getAttribute("data-i18n-html")] });
  });
  var title = d.title;
  var metas = [].slice.call(d.querySelectorAll('meta[name="description"], meta[property^="og:"][property$="title"], meta[property="og:description"]'))
    .map(function (m) { return { el: m, en: m.content }; });

  var switches = [].slice.call(d.querySelectorAll("[data-lang]"));

  function apply() {
    root.lang = lang;
    var k = LANGS.indexOf(lang);
    texts.forEach(function (x) { x.node.nodeValue = x.lead + t(x.en) + x.trail; });
    attrs.forEach(function (x) { x.el.setAttribute(x.name, t(x.en)); });
    blocks.forEach(function (x) { x.el.innerHTML = k ? x.tr[k - 1] : x.en; });
    metas.forEach(function (x) { x.el.content = t(x.en); });
    d.title = t(title);
    switches.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    subs.forEach(function (fn) { fn(lang); });
  }

  var swapTimer;
  function set(next) {
    if (next === lang || LANGS.indexOf(next) < 0) return;
    lang = next;
    root.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    clearTimeout(swapTimer);
    if (rm.matches) { apply(); return; }
    /* Fade the copy out, swap while it is invisible, fade back in. */
    root.classList.add("lang-out");
    swapTimer = setTimeout(function () {
      apply();
      root.classList.remove("lang-out");
    }, 160);
  }

  switches.forEach(function (b) {
    b.addEventListener("click", function () { set(b.getAttribute("data-lang")); });
  });

  window.I18N = {
    t: t,
    set: set,
    on: function (fn) { subs.push(fn); },
    get lang() { return lang; }
  };

  apply();
  root.classList.remove("i18n-wait");
})();
