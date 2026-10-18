/**
 * AETHER KICKS - High-Performance Luxury Internationalization (i18n) Engine
 * Seamlessly manages Portuguese (PT) & English (EN) translations across all pages.
 * Persists user preference via localStorage and updates the DOM dynamically.
 */

(function () {
  'use strict';

  var translations = {
    pt: {
      // Navigation
      nav_runway: 'Passarela',
      nav_grid: 'Grade',
      nav_lab: 'Bespoke Lab',
      nav_drops: 'Drops',
      nav_analytics: 'Estatísticas',
      nav_about: 'Sobre Nós',
      nav_audio: 'ÁUDIO',
      nav_wishlist: 'WISHLIST',
      nav_bag: 'SACO',
      nav_profile: 'Perfil',
      nav_signin: 'Iniciar Sessão',
      nav_join_vault: 'Juntar ao Vault',
      nav_perf_on: 'PERF: ON',
      nav_perf_off: 'ULTRA: ON',
      drawer_perf_mode: 'Modo Desempenho / Performance',
      toast_perf_on: 'Modo Desempenho Ativo ⚡ (60-120 FPS)',
      toast_perf_off: 'Modo Ultra Suave Ativo 🎨 (Cores Contínuas)',
      nav_menu_title: 'Menu do Arquivo',
      presentation_mode: 'Modo de Apresentação',
      drawer_language: 'Idioma / Language',
      audio_atmosphere: 'Áudio Atmosférico',

      // Hamburger Menu Links
      menu_01: 'Arquivo Passarela',
      menu_02: 'O Cofre de Grails',
      menu_03: 'Laboratório Bespoke',
      menu_04: 'Lançamentos Ao Vivo',
      menu_05: 'Análise de Mercado',
      menu_06: 'Sobre Nós',
      menu_07: 'A Tua Wishlist',
      menu_08: 'Perfil de Colecionador',
      menu_09: 'Verificação NFC',
      menu_footer_auth: 'ARQUIVO SNEAKERHEAD AUTENTICADO © 2026',

      // Square Grid Vault Section
      catalog_badge: 'ARQUIVO DO CATÁLOGO',
      catalog_title: 'O COFRE DE GRAILS',
      catalog_desc: 'Explora a nossa linhagem de cano alto autenticada em formato de grade ou volta à passarela imersiva a qualquer momento.',
      ask_price: 'PREÇO DE PEDIDO',
      in_stock: 'EM STOCK',
      instant_buy: 'Comprar Já',
      instant_buy_now: 'Comprar Já Agora',
      view_runway: 'Ver Passarela',
      save_wishlist: 'Guardar na Wishlist',

      // Runway Stages & Badges
      badge_drop_01: 'DROP 01 • DEADSTOCK',
      badge_drop_02: 'DROP 02 • DEADSTOCK',
      badge_drop_03: 'DROP 03 • DEADSTOCK',
      badge_drop_04: 'DROP 04 • DEADSTOCK',
      badge_drop_05: 'DROP 05 • DEADSTOCK',
      badge_drop_06: 'DROP 06 • DEADSTOCK',
      badge_deadstock: 'DEADSTOCK 100%',
      badge_heritage: 'HERITAGE',
      badge_atelier: 'ATELIER 1-OF-1',

      // Spec Table Labels & Hotspots
      spec_style_code: 'CÓDIGO DE ESTILO',
      spec_original_year: 'ANO ORIGINAL',
      spec_upper_leather: 'COURO SUPERIOR',
      spec_cushioning: 'AMORTECIMENTO',
      spec_leather_vachetta: 'Vachetta Integral',
      spec_leather_tumbled: 'Couro Texturado Amethyst',
      spec_leather_nubuck: 'Nobuck Suave Carolina',
      spec_leather_grain: 'Couro de Grão Encorpado',
      spec_leather_museum: 'Couro Calibre Museu',
      spec_leather_blackcat: 'Nobuck Grafite Triple Black',
      spec_cushion_air: 'Air Encapsulado',
      spec_hotspot_highcut: 'CORTE ALTO OG 1985',
      spec_hotspot_air: 'AIR ENCAPSULADO',
      spec_hotspot_leather: 'COURO PREMIUM',
      spec_hotspot_wings: 'LOGO WINGS EM RELEVO',
      spec_hotspot_outsole: 'TRAÇÃO CONCÊNTRICA OG',

      // Shoe Descriptions / Stories (Runway)
      story_chicago: 'As sapatilhas que deram início a uma revolução global. Multadas em $5.000 por jogo pela NBA, Michael Jordan usou-as mesmo assim. O grail supremo da cultura sneaker.',
      story_purple: 'Intensidade régia. Painéis brancos equilibrados com couro texturado ametista de calibre de coleção e detalhes em preto profundo.',
      story_blue: 'Homenagem à alma mater universitária de Michael Jordan. Nobuck suave envolvido no icónico tom de azul dos Tar Heels com sobreposições Obsidian.',
      story_green: 'Postura imponente em verde pinho com detalhes gym red na etiqueta da língua e couro preto de grão refinado.',
      story_orange: 'Inspiradas no jogo de exibição de 1985 em Itália onde Jordan partiu a tabela de vidro em estilhaços com um afundanço histórico.',
      story_shadow: 'O ícone stealth inspirado na alcunha mais feroz de MJ. Construído em nobuck preto grafite com ferragens escuras e grelhas mate.',

      // Buy Card Controls
      market_trend: 'Tendência de Mercado',
      select_size: 'Selecionar Tamanho',
      selected_prefix: 'Selecionado:',
      add_to_bag: 'Adicionar ao Saco',
      inspect_specs: 'Inspecionar Especificações & História',
      guarantee_auth: 'Autenticação Física Forense',
      guarantee_shipping: 'Envio Prioritário 48h',

      // Marquee Ribbon
      marquee_100: '100% DEADSTOCK VERIFICADO',
      marquee_nfc: 'AUTENTICAÇÃO FÍSICA & DIGITAL NFC',
      marquee_delivery: 'ENTREGA PRIORITÁRIA EXPRESSA EM 48H',
      marquee_lineup: 'CHICAGO • COURT PURPLE • UNIVERSITY BLUE • PINE GREEN',
      marquee_vault: 'O ARQUIVO DEFINITIVO DE SNEAKERHEADS',
      marquee_noreps: 'RÉPLICAS NUNCA SÃO PERMITIDAS',

      // Vault Catalog Section (#catalog-vault)
      catalog_vault_badge: 'ARQUIVO COMPLETO DE LANÇAMENTOS',
      catalog_vault_title: 'Catálogo do Vault',
      catalog_vault_desc: 'Explora colorways icónicas autenticadas, compara cotações atuais de mercado e assegura o teu grail definitivo.',
      filter_all: 'Todos os Grails (6)',
      filter_red: 'Chicago Red',
      filter_purple: 'Court Purple',
      filter_blue: 'University Blue',
      filter_green: 'Pine Green',
      filter_orange: 'Shattered',
      starting_at: 'A PARTIR DE',
      buy_now: 'Comprar Já',
      story_chicago_short: 'O clássico original de 1985 em couro de grão integral premium e acabamento vermelho varsity.',
      story_purple_short: 'Painéis em ametista nobre com equilíbrio perfeito de branco límpido e preto profundo.',
      story_blue_short: 'Nobuck azul pó em homenagem à alma mater universitária de Michael Jordan.',
      story_green_short: 'Couro texturado verde pinho com detalhes gym red na etiqueta da língua.',
      story_orange_short: 'Couro de qualidade de museu em celebração ao épico afundanço que partiu a tabela em 1985.',
      story_shadow_short: 'Silhueta furtiva triple black em nobuck macio com rede de ventilação mate.',

      // 3D Turntable HUD
      turntable_auto: 'Auto 360°',
      turntable_pause: 'Pausar 360°',
      turntable_side: 'Lateral',
      turntable_34: 'Vista 3/4',
      turntable_aerial: 'Aérea',
      turntable_heel: 'Calcanhar',
      turntable_sole: 'Sola',

      // Bespoke Lab & Studio
      lab_badge: 'LABORATÓRIO BESPOKE AETHER',
      lab_title: 'LABORATÓRIO DE CORES BESPOKE',
      lab_desc: 'Personaliza painéis de couro em 3D em tempo real ou visualiza esquemas técnicos do nosso Atelier de Lisboa.',
      lab_mode_studio: 'Estúdio 3D',
      lab_mode_blueprint: 'Esquema Técnico',
      lab_material_preset: 'PRESET DE MATERIAIS',
      lab_select_part: 'SELECIONAR COMPONENTE',
      lab_panel_base: 'Base Superior',
      lab_panel_overlay: 'Sobreposição',
      lab_panel_swoosh: 'Swoosh',
      lab_panel_collar: 'Colarinho',
      lab_panel_laces: 'Atacadores',
      lab_panel_sole: 'Sola Exterior',
      lab_leather_finish: 'ACABAMENTO DO COURO',
      lab_finish_matte: 'Couro Mate',
      lab_finish_patent: 'Verniz Brilhante',
      lab_finish_distressed: 'Couro Envelhecido',
      lab_engraving_title: 'GRAVAÇÃO A LASER PERSONALIZADA',
      lab_engraving_placeholder: 'Grava o teu monograma ou tag (ex: GRAIL-01)',
      lab_unit_selector: 'UNIDADE:',
      lab_btn_reset: 'Repor Original',
      lab_btn_save: 'Guardar Criação',
      lab_btn_order: 'Encomendar Bespoke 1-of-1',

      // Live Drops HUD
      drops_badge: 'CALENDÁRIO DE DROPS',
      drops_title: 'LANÇAMENTOS DO VAULT AO VIVO',
      drops_next_drop: 'Próximo Lançamento:',
      drops_timer_days: 'DIAS',
      drops_timer_hours: 'HORAS',
      drops_timer_mins: 'MINS',
      drops_timer_secs: 'SEGS',
      drops_raffle_badge: 'ACESSO ANTECIPADO POR SORTEIO',
      drops_shoes_remaining: 'PARES DISPONÍVEIS',
      drops_entrants: 'COLECIONADORES INSCRITOS',
      drops_allocation: 'ALOCAÇÃO VERIFICADA',
      drops_enter_raffle: 'Entrar no Sorteio Criptográfico',
      drops_msrp_badge: 'MSRP $190 (Resale Est. $1.450)',

      // Market Analytics
      analytics_badge: 'TELEMETRIA DE MERCADO',
      analytics_title: 'ÍNDICE DE VALORIZAÇÃO DE GRAILS',
      analytics_hero_title: 'Índice de Cotação Air Jordan 1 Chicago',
      analytics_trend_positive: '+28.6% NO ÚLTIMO ANO',
      analytics_volatility: 'Volatilidade 30D',
      analytics_liquidity: 'Índice de Liquidez',
      analytics_market_cap: 'Valor do Portfólio',
      analytics_historical_sales: 'VENDAS HISTÓRICAS',
      analytics_avg_margin: 'MARGEM MÉDIA DE VALORIZAÇÃO',
      analytics_live_trades: 'TRANSAÇÕES AO VIVO NO COFRE',

      // Bag / Cart Drawer
      cart_title: 'Saco de Colecionador',
      cart_empty_title: 'O teu saco está atualmente vazio',
      cart_empty_desc: 'Explora a passarela e assegura o teu grail favorito.',
      cart_explore_showcase: 'Explorar Coleção',
      cart_subtotal: 'Subtotal',
      cart_shipping: 'Envio Expresso Assegurado',
      cart_shipping_free: 'Gratuito',
      cart_total: 'Total Estimado',
      cart_checkout: 'Avançar para Checkout',
      cart_promo_placeholder: 'Código Promo (ex: GRAIL20)',
      cart_promo_apply: 'Aplicar',

      // NFC Verification Modal
      nfc_modal_title: 'Autenticação Criptográfica NFC',
      nfc_modal_desc: 'Aproxime o seu smartphone ou leitor da etiqueta NFC costurada na língua do calçado.',
      nfc_status_ready: 'Pronto para leitura...',
      nfc_btn_scan: 'Iniciar Verificação NFC',
      nfc_step_1: '1. Aproxime o leitor da língua',
      nfc_step_2: '2. Verificação de chave criptográfica',
      nfc_step_3: '3. Certificado de custódia emitido',

      // Buy Modal & Checkout
      buy_modal_title: 'Reserva Imediata de Grail',
      buy_modal_subtitle: 'Autenticação forense garantida e custódia física com envio prioritário segurado.',
      checkout_step1: '1. Dados de Envio',
      checkout_step2: '2. Método de Pagamento',
      checkout_confirm: 'Confirmar Encomenda Segurada',

      // About Us Page
      about_hero_badge: 'ARQUIVO HISTÓRICO & ATELIER BESPOKE · EST. 2026',
      about_hero_title: 'O Manifesto AETHER KICKS',
      about_hero_desc: 'Onde o artesanato de sapataria de alta precisão se cruza com a validação forense e a preservação deadstock.',
      about_section_title: 'Do Asfalto Underground à Vanguarda do Colecionismo',
      about_pillar_01_title: 'Autenticidade Inegociável',
      about_pillar_02_title: 'Artesanato 1-of-1 Bespoke',
      about_pillar_03_title: 'Preservação da Cultura Sneaker',
      about_pillar_04_title: 'Custódia Digital & NFC',

      // Profile & Wishlist Pages
      profile_title: 'Perfil de Colecionador & Estado do Vault',
      profile_hero_badge: 'CENTRO DE GESTÃO DO COLECIONADOR · LISBON ATELIER',
      profile_hero_title: 'Configurações do Perfil',
      profile_hero_desc: 'Gere os teus dados de envio em Portugal, tamanho de calçado padrão, morada para entregas prioritárias e histórico de encomendas autenticadas.',
      wishlist_title: 'A Tua Wishlist Autenticada',
      wishlist_hero_badge: 'COFRE PESSOAL DE SNEAKERS · LISTA DE GRAILS',
      wishlist_hero_title: 'A Tua Wishlist de Grails',
      wishlist_hero_desc: 'Os pares mais cobiçados do mundo preservados no teu radar. Reserva, compra instantaneamente ou personaliza no nosso Atelier Bespoke.',

      // Auth (Login & Register)
      auth_chicago_badge: 'ACESSO CHICAGO RETRO 1985',
      auth_purple_badge: 'REGISTO COURT PURPLE 2020',
      login_title: 'Bem-vindo de Volta',
      login_subtitle: 'Inicia sessão para desbloquear lançamentos exclusivos, licitações privadas e grails autenticados.',
      login_email_label: 'Email ou Tag do Colecionador',
      login_password_label: 'Palavra-passe',
      login_remember_me: 'Lembrar sessão neste dispositivo',
      login_submit_btn: 'Aceder ao Cofre Privado',
      login_no_account: 'Novo colecionador no arquivo?',
      login_register_link: 'Criar Registo Deadstock →',
      register_title: 'Junta-te ao Arquivo',
      register_subtitle: 'Cria a tua identidade de colecionador para garantir alocação prioritária e lançamentos privados.',
      register_fullname_label: 'Nome Completo do Colecionador',
      register_email_label: 'Endereço de Email Oficial',
      register_password_label: 'Criar Palavra-passe',
      register_size_label: 'Tamanho Preferido de Calçado',
      register_terms_label: 'Concordo com os Termos de Autenticação Forense e Regras do Cofre',
      register_submit_btn: 'Criar Conta de Colecionador',
      register_already_registered: 'Já estás registado no cofre?',
      register_login_link: 'Iniciar Sessão Aqui →',
      // Additional Storefront & Modal Keys
      badge_limited_01: 'DROP LIMITADO 01',
      badge_limited_02: 'DROP LIMITADO 02',
      badge_limited_03: 'DROP LIMITADO 03',
      badge_limited_04: 'DROP LIMITADO 04',
      badge_limited_05: 'DROP LIMITADO 05',
      badge_limited_06: 'DROP LIMITADO 06',
      badge_royal_amethyst: 'AMETISTA RÉGIO',
      badge_tar_heel: 'HERITAGE TAR HEEL',
      badge_stealth_emerald: 'ESMERALDA STEALTH',
      badge_italy_exhibition: 'EXIBIÇÃO DE ITÁLIA',
      badge_stealth_grail: 'GRAIL STEALTH',
      spec_release_era: 'ERA DE LANÇAMENTO',
      spec_leather_grade: 'GRAU DO COURO',
      spec_outsole: 'SOLA EXTERIOR',
      spec_collaboration: 'COLABORAÇÃO',
      spec_material: 'MATERIAL',
      spec_inner_lining: 'FORRO INTERIOR',
      spec_texture: 'TEXTURA',
      spec_tongue_tag: 'ETIQUETA DA LÍNGUA',
      spec_nickname: 'ALCUNHA',
      spec_sail_midsole: 'ENTRESOLA SAIL',
      spec_insole_graphic: 'GRÁFICO DA PALMILHA',
      spec_silhouette: 'SILHUETA',
      spec_upper_material: 'MATERIAL SUPERIOR',
      lab_heading: 'Cria o Teu Grail 1-de-1',
      lab_subheading: 'Assume a direção artística sobre silhuetas Jordan autênticas. Seleciona painéis, cria esquemas cromáticos exclusivos e adiciona pares personalizados ao teu saco.',
      lab_studio_mode: 'Estúdio Fotorrealista',
      lab_blueprint_mode: 'Esquema Técnico',
      lab_label_component: 'Selecionar Componente para Colorir',
      lab_label_swatches: 'Amostras de Cor Heritage Curadas',
      lab_label_size: 'Tamanho Bespoke / Size',
      lab_commission: 'COMISSÃO BESPOKE',
      lab_add_bag: 'Adicionar 1-de-1 ao Saco',
      drops_next_global: 'PRÓXIMO LANÇAMENTO GLOBAL',
      drops_tier0: 'ALOCAÇÃO TIER 0',
      drops_hours: 'Horas',
      drops_minutes: 'Minutos',
      drops_seconds: 'Segundos',
      drops_millisec: 'Milisseg',
      drops_verified_sha: '🔒 Verificado via Livro de Entropia SHA-256',
      analytics_live_market: 'MERCADO SECUNDÁRIO AO VIVO',
      analytics_1yr: '1 Ano',
      analytics_6mo: '6 Meses',
      analytics_all: 'Todo o Histórico',
      analytics_median_val: 'Valor Mediano Atual',
      analytics_12m_appreciation: 'Valorização em 12 Meses',
      analytics_30d_liquidity: 'Volume Liquidez 30D',
      analytics_volatility_idx: 'Índice de Volatilidade',
      checkout_modal_badge: 'CHECKOUT CRIPTOGRÁFICO ENCRIPTADO',
      checkout_modal_title: 'Finalizar Reserva de Grail',
      checkout_modal_desc: 'Par deadstock 100% autêntico reservado no cofre por 10 minutos.',
      checkout_shipping_name: 'Nome Completo de Envio',
      checkout_street_address: 'Morada de Envio',
      checkout_city_state: 'Cidade / Distrito',
      checkout_postal_code: 'Código Postal',
      checkout_payment_method: 'Selecionar Método de Pagamento',
      checkout_pay_btn: 'Confirmar Compra Segura',
      nfc_sensor_active: 'SENSOR CRIPTOGRÁFICO ATIVO',
      nfc_hold_device: 'Aproxime o Dispositivo da Língua',
      nfc_interrogating: 'A interrogar chip de segurança criptográfico RFID/NFC na etiqueta...',
      nfc_status_querying: 'ESTADO: A CONSULTAR PROVA DESCENTRALIZADA DE AUTENTICIDADE...',
      nfc_verified_badge: 'GRAIL ORIGINAL VERIFICADO',
      nfc_verified_title: '100% Autenticidade Garantida',
      nfc_done_btn: 'Verificação Concluída',
      raffle_badge: 'SORTEIO LIMITADO',
      raffle_desc: 'Assina a entrada no sorteio criptográfico. Os vencedores receberão acesso instantâneo ao checkout.',
      raffle_collector_name: 'Nome do Colecionador',
      raffle_email: 'Endereço de Email',
      raffle_select_size: 'Selecionar Tamanho Preferido',
      raffle_btn: 'Confirmar Inscrição no Sorteio',
      about_section_badge: 'O MANIFESTO & HERITAGE DO ARQUIVO',
      about_heading: 'Onde a Cultura Street Cruza a Precisão Forense.',
      about_lead_desc: 'Fundada por colecionadores obcecados e artesãos digitais, a AETHER KICKS une a nostalgia visceral dos grails de 1985 ao arquivo digital interativo de alta precisão. Acreditamos que cada par encerra um marco cultural que merece verificação forense, preservação climática imaculada e custódia transparente.',
      about_pillar_1_title: 'Auditoria Forense em 12 Pontos',
      about_pillar_1_desc: 'Espetroscopia, luminescência UV, auditorias de densidade de costura e micro-texto por curadores especializados.',
      about_pillar_2_title: 'Chips Criptográficos NFC',
      about_pillar_2_desc: 'Cada silhueta física é selada com um chip NFC encriptado com proveniência imutável e descentralizada.',
      about_pillar_3_title: 'Custódia em Cofre Climatizado',
      about_pillar_3_desc: 'Grails deadstock preservados em cofres estabilizados contra raios UV e humidade para evitar a oxidação.',
      about_pillar_4_title: 'Liquidez Secundária',
      about_pillar_4_desc: 'Índices de cotação em tempo real, telemetria de tendências históricas e recompra imediata assegurada.',
      about_btn_manifesto: 'Conhecer o Manifesto & História Completa',
      about_btn_visit: 'Visitar O Atelier',
      about_stat_auth: 'Garantia de Autenticidade',
      about_stat_grails: 'Grails Verificados & Entregues',
      about_stat_forensic: 'Auditoria Forense Física',
      about_stat_counterfeit: 'Tolerância a Falsificações',
      footer_tagline: 'A plataforma definitiva de luxo para grails verificados. Experimenta lançamentos de alta resolução, custódia autenticada e esquemas cromáticos dinâmicos.',
      footer_col_runway: 'Colorways da Passarela',
      footer_col_atelier: 'Atelier & Autenticação',
      footer_col_membership: 'Membros do Arquivo',
      footer_copyright: '© 2026 ARQUIVO AETHER KICKS. Todos os direitos reservados.',
      footer_built: 'Desenvolvido com HTML5, CSS3 e JavaScript Vanilla Moderno.',
      back_storefront: 'Voltar à Loja',

      // Extended About Page Keys
      about_page_title: 'Sobre Nós | AETHER KICKS - Atelier Manifesto & Sneakerhead Archive',
      about_bc_vault: 'The Vault',
      about_bc_atelier: 'Atelier',
      about_bc_current: 'Sobre Nós & Manifesto',
      about_hero_badge_alt: 'MANIFESTO DO ATELIER · EST. 2021',
      about_main_hero_title: 'Nascidos no Underground.<br>Criados para Colecionadores de Grails.',
      about_main_hero_desc: 'Uma ponte inabalável entre a nostalgia visceral dos courts de 1985 e o artesanato bespoke de alta precisão. Custodiamos história e criamos obras de arte para calçar.',
      about_cta_explore: 'Explorar O Cofre de Grails',
      about_specimen_badge: 'ESPÉCIME OG #001',
      about_deadstock_badge: 'ARQUIVO DEADSTOCK',
      about_spec_matrix: 'SILHUETA MATRIZ',
      about_spec_matrix_val: 'Air Jordan 1 High (Corte 1985)',
      about_spec_cert: 'CERTIFICAÇÃO',
      about_spec_cert_val: '14 Pontos Forenses + NFC',
      about_origins_eyebrow: 'A NOSSA ORIGEM · DE LISBOA & PORTO PARA O MUNDO',
      about_origins_headline: 'Do Asfalto Underground à Vanguarda do Colecionismo.',
      about_origins_desc: 'O que começou como uma obsessão silenciosa por solas amareladas pelo tempo transformou-se no atelier de custódia e personalização mais exclusivo da Europa.',
      about_origins_lead: 'A AETHER KICKS não nasceu numa sala de reuniões corporativa. Nasceu no piso em calçada do Bairro Alto e nas ruelas históricas do Chiado, em Lisboa, onde colecionadores de ténis trocavam pares raros no porta-bagagens de carros sob a luz fraca dos candeeiros urbanos.',
      about_origins_p1: 'Em 2021, o mercado de sapatilhas estava inundado de drops digitais instantâneos, bots impessoais e uma epidemia sem precedentes de réplicas quase impercetíveis a olho nu. O valor sagrado do "Grail" — a caça apaixonada por aquele par mítico com história real — estava a desvanecer-se.',
      about_origins_p2: 'Decidimos construir o refúgio oposto: um santuário físico e digital onde cada silhueta é tratada com a reverência de uma pintura renascentista. Estabelecemos o nosso cofre inicial com 40 pares originais de 1985 e aliámo-nos aos lendários mestres sapateiros do norte de Portugal, em São João da Madeira e no Porto, combinando a centenária manufatura do couro português com as silhuetas de basquetebol mais cobiçadas do planeta.',
      about_origins_quote: '"Um grail autêntico não é mero couro e borracha prensada; é uma cápsula do tempo cultural. O nosso dever é preservá-lo com rigor cirúrgico para a próxima geração."',
      about_origins_author: '— DIOGO V. & GUILDA CURATORIAL AETHER',
      about_time_2021_loc: 'Chiado, Lisboa',
      about_time_2021_title: 'O Cofre Secreto do Chiado',
      about_time_2021_desc: 'Aquisição do primeiro acervo privado de 40 pares deadstock de 1985. Instalação da primeira câmara de desumidificação com controlo barométrico e temperatura estabilizada.',
      about_time_2023_loc: 'Atelier Lab Porto',
      about_time_2023_title: 'O Atelier Bespoke & Restauração OG',
      about_time_2023_desc: 'Abertura da oficina de manufatura no Quarteirão das Artes no Porto. Primeiras recriações 1-of-1 feitas à mão com peles de curtumes toscanos e solas donor restauradas.',
      about_time_2025_loc: 'Laboratório Forense',
      about_time_2025_title: 'Protocolo Criptográfico AETHER Tag™',
      about_time_2025_desc: 'Implementação do chip NFC inviolável embutido na língua de cada exemplar, ligando cada par físico a uma prova de proveniência perpétua e imutável.',
      about_time_2026_loc: 'Passarela Global AETHER',
      about_time_2026_title: 'A Passarela Cromática & Liquidez Vault',
      about_time_2026_desc: 'Lançamento do showroom interativo em tempo real, garantia vitalícia com buyback assegurado e envios prioritários para colecionadores em toda a Europa.',
      about_mission_eyebrow: 'PROPÓSITO & PRINCÍPIOS · OS MANDAMENTOS SAGRADOS',
      about_mission_headline: 'A Nossa Missão: Redefinir a Custódia de Grails.',
      about_mission_desc: 'Existimos para erradicar a incerteza no mercado de calçado de alto valor através de três princípios inegociáveis.',
      about_tenet_1_title: 'Autenticidade Inegociável',
      about_tenet_1_desc: 'Zero tolerância para réplicas ou representações dúbias. Cada exemplar admitido no cofre é submetido a uma auditoria física manual em 14 pontos forenses, análise espectrométrica de colas sob luz UV e selagem final com chip NFC criptográfico. Se não for 100% puro, não entra.',
      about_tenet_1_tag: 'AUDITORIA FORENSE DE 14 PONTOS · ZERO TOLERÂNCIA',
      about_tenet_2_title: 'Artesanato 1-of-1 Bespoke',
      about_tenet_2_desc: 'Não produzimos em massa. O nosso atelier laboratorial constrói obras sob encomenda individual, utilizando peles nobres de curtumes certificados de Itália e Portugal, costuradas à mão com linhas enceradas alemãs e seguindo religiosamente os moldes anatómicos de corte alto de 1985.',
      about_tenet_2_tag: 'PELES NOBRES EUROPEIAS · MANUFATURA ARTESANAL',
      about_tenet_3_title: 'Preservação da Cultura Sneaker',
      about_tenet_3_desc: 'Ténis históricos são marcos de design e contracultura que merecem conservação de nível museológico. As nossas câmaras de vácuo e climatização a 16°C travam a oxidação da borracha e a degradação de poliuretano, garantindo que os grails sobrevivem intactos para as próximas décadas.',
      about_tenet_3_tag: 'CÂMARA CLIMATIZADA DEADSTOCK · PROTEÇÃO ANTI-HIDRÓLISE',
      about_pillars_eyebrow: 'SISTEMA DE PROTEÇÃO FORENSE · OS 4 PILARES',
      about_pillars_headline: 'Os 4 Pilares da Autenticidade Absoluta.',
      about_pillars_desc: 'Um protocolo em quatro camadas que combina peritagem humana especializada com criptografia de ponta a ponta.',
      about_pillar_1_head: '1. Micro-inspeção Forense',
      about_pillar_1_body: 'Auditoria microscópica 50x de densidade de costuras (8.5 pontos/polegada), espessura do corte da flor do couro e assinatura de luminescência sob luz UV para detetar resíduos químicos contemporâneos.',
      about_pillar_1_badge: 'AUDITORIA FÍSICA · 14 PONTOS',
      about_pillar_2_head: '2. Certificado Digital NFC',
      about_pillar_2_body: 'Microchip criptográfico NTAG de alta segurança embutido sob a etiqueta da língua. Ao aproximar qualquer smartphone moderno, é verificado o selo inviolável com assinatura SHA-256 no nosso ledger privado.',
      about_pillar_2_badge: 'CHIP NFC SHA-256 IMUTÁVEL',
      about_pillar_3_head: '3. Câmara Climatizada Deadstock',
      about_pillar_3_body: 'Antes de serem expedidos, todos os grails repousam no nosso cofre a 16°C com 48% de humidade relativa controlada, filtragem de partículas HEPA e proteção absoluta contra raios ultravioleta.',
      about_pillar_3_badge: 'CUSTÓDIA ATÉ EXPEDIÇÃO',
      about_pillar_4_head: '4. Garantia Vitalícia & Buyback',
      about_pillar_4_body: 'Emitimos uma garantia contratual vitalícia de originalidade: se qualquer par AETHER for refutado por peritagem acreditada, reembolsamos 200% do valor. Oferecemos também recompra instantânea a valor de mercado.',
      about_pillar_4_badge: '200% REEMBOLSO + LIQUIDEZ',
      about_proc_eyebrow: 'MANUFATURA PASSO A PASSO · O ATELIER LAB',
      about_proc_headline: 'O Processo do Atelier: Da Matriz ao Grail.',
      about_proc_desc: 'Conheça o ciclo rigoroso de intervenção artesanal aplicado a cada encomenda bespoke e par histórico curado.',
      about_step_1_num: 'PASSO 01',
      about_step_1_title: 'Seleção da Base OG',
      about_step_1_desc: 'Triagem minuciosa de pares matriz autênticos ou recolha de soles vintage "donor". Avaliação da integridade estrutural da entressola de borracha e da caixa de ar encapsulada.',
      about_step_1_spec: 'CRITÉRIO: 100% DEADSTOCK OU VINTAGE INTACTO',
      about_step_2_num: 'PASSO 02',
      about_step_2_title: 'Descontaminação & Preparação',
      about_step_2_desc: 'Desconstrução cirúrgica com separação de pontos, higienização criogénica com CO2 seco para eliminar poeiras microscópicas e assentamento da estrutura no molde de last 1985.',
      about_step_2_spec: 'PROCESSO: LIMPEZA CRIOGÉNICA & LAST 1985',
      about_step_3_num: 'PASSO 03',
      about_step_3_title: 'Tingimento Manual & Costura',
      about_step_3_desc: 'Corte manual das peças de couro de flor integral provenientes dos curtumes toscanos. Aplicação de pigmentos resistentes a raios UV e costura individual com linha alemã de alta tensão.',
      about_step_3_spec: 'MATERIAIS: COURO ITALIANO & LINHA ENCERADA',
      about_step_4_num: 'PASSO 04',
      about_step_4_title: 'Acabamento & Selagem NFC',
      about_step_4_desc: 'Tratamento de impermeabilização com cera de abelha natural, inserção do microchip NFC sob a etiqueta da língua, auditoria final de 14 pontos e acondicionamento na Aether Vault Box.',
      about_step_4_spec: 'EXPEDIÇÃO: ACRÍLICO FUMADO + CERTIFICADO NFC',
      about_stat_delivered: 'Grails Entregues em Portugal & Europa',
      about_stat_auth_rate: 'Taxa de Autenticidade Inviolável',
      about_stat_express: 'Envio Prioritário Segurado em Mão',
      about_stat_vip_score: 'Avaliação dos Colecionadores VIP',
      about_concierge_eyebrow: 'VISITAS PRIVADAS & ENCOMENDAS · CONTACTO & MARCAÇÃO',
      about_concierge_headline: 'Entre no Nosso Atelier. Fale com os Curadores.',
      about_concierge_desc: 'O nosso espaço físico em Lisboa e laboratório no Porto recebem colecionadores sob marcação prévia para inspeção de peças do cofre, consultoria de investimento ou projetos bespoke à medida.',
      about_studio_lisbon_tag: 'CONCEPT STUDIO LISBOA',
      about_studio_lisbon_name: 'AETHER Vault Chiado',
      about_studio_lisbon_addr: 'Rua da Prata, n.º 142, 2.º Andar<br>1100-420 Lisboa, Portugal',
      about_studio_lisbon_hours: 'Segunda a Sábado: 10h00 - 19h30 (Exclusivo com Marcação)',
      about_studio_porto_tag: 'ATELIER LAB PORTO',
      about_studio_porto_name: 'AETHER Bespoke Workshop',
      about_studio_porto_addr: 'Rua de Miguel Bombarda, n.º 285<br>4050-377 Porto, Portugal',
      about_studio_porto_hours: 'Terça a Sexta: 11h00 - 19h00 (Visitas Técnicas de Artesanato)',
      about_form_title: 'Agendar Consulta Privada ou Pedido Bespoke',
      about_form_desc: 'Preencha os dados abaixo para reservar uma sessão presencial no atelier ou submeter uma comissão de design personalizado. O nosso curador responderá em menos de 4 horas.',
      about_form_lbl_name: 'Nome do Colecionador',
      about_form_ph_name: 'Ex: Gonçalo Matos',
      about_form_lbl_email: 'Email de Contacto',
      about_form_ph_email: 'colecionador@exemplo.pt',
      about_form_lbl_phone: 'Telemóvel / WhatsApp',
      about_form_ph_phone: '+351 91X XXX XXX',
      about_form_lbl_type: 'Finalidade da Consulta',
      about_opt_bespoke: 'Comissão 1-of-1 Bespoke Atelier',
      about_opt_lisbon: 'Visita Privada ao Vault de Lisboa',
      about_opt_porto: 'Visita Técnica ao Lab do Porto',
      about_opt_sourcing: 'Aquisição / Sourcing de Grail Específico',
      about_opt_auth: 'Autenticação Forense de Par Próprio',
      about_form_lbl_details: 'Detalhes do Projeto / Silhueta de Interesse',
      about_form_ph_details: 'Descreva a silhueta, tamanho (US), personalizações pretendidas ou data preferencial para visita...',
      about_form_btn_submit: 'Submeter Pedido ao Concierge VIP',
      nfc_cipher_status: 'STATUS: SISTEMA CRIPTOGRÁFICO ATIVO • SHA-256',
      nfc_close_btn: 'Fechar Verificador',

      // Extended Wishlist Keys
      wishlist_page_title: 'Wishlist de Grails | AETHER KICKS - Cofre Pessoal de Sneakers',
      wishlist_loading: 'A carregar grails guardados...',
      wishlist_saved_single: 'Grail Guardado',
      wishlist_saved_plural: 'Grails Guardados',
      wishlist_stat_vault: 'Lisbon Deadstock Vault',
      wishlist_stat_nfc: 'NFC Verificado',
      wishlist_empty_title: 'O Teu Cofre de Grails Está Vazio',
      wishlist_empty_desc: 'Ainda não guardaste nenhum par no teu arquivo pessoal. Explora a nossa passarela imersiva de Air Jordan 1 e guarda os teus modelos sagrados.',
      wishlist_empty_btn: 'Explorar o Vault de 1985 →',
      select_size_eu: 'Selecionar Tamanho (EU / PT):',
      add_pair_bag: 'Adicionar Par ao Saco',
      cart_discount: 'Desconto Promo',
      wishlist_remove_title: 'Remover da Wishlist',
      profile_toast_saved: '✅ Perfil guardado com sucesso! Sincronizado com o Atelier.',
      profile_confirm_reset: 'Deseja restaurar as configurações padrão de colecionador?',
      profile_confirm_logout: 'Deseja terminar a sessão no cofre de colecionador?',
      profile_toast_logout: 'Sessão terminada. A redirecionar...',
      checkout_pay_credit: 'Cartão Crédito',
      checkout_discount_label: 'Desconto de Grail (20% OFF):',
      checkout_shipping_label: 'Envio Expresso Prioritário:',
      checkout_total_label: 'Total a Pagar:',

      // Extended Profile Keys
      profile_page_title: 'Configuração do Perfil | AETHER KICKS - Painel do Colecionador',
      profile_tier_patron: 'TIER 1 · VAULT PATRON',
      profile_stat_portfolio: 'VALOR DO PORTFÓLIO',
      profile_stat_collection: 'COLEÇÃO ATIVA',
      profile_tab_personal: 'Dados Pessoais & Tamanhos',
      profile_tab_shipping: 'Morada em Portugal',
      profile_tab_orders: 'Histórico de Encomendas',
      profile_tab_security: 'Segurança & Atelier',
      profile_sec1_title: '1. Dados Pessoais & Preferências de Tamanho',
      profile_badge_auth: 'AUTENTICADO',
      profile_lbl_fullname: 'Nome Completo',
      profile_lbl_tag: 'Tag de Colecionador',
      profile_lbl_email: 'Email de Notificações',
      profile_lbl_phone: 'Contacto Móvel / WhatsApp (Portugal)',
      profile_lbl_default_size: 'Tamanho Padrão de Sneakers',
      profile_size_note: '* O tamanho selecionado será pré-configurado nas compras instantâneas e no Atelier Bespoke.',
      profile_sec2_title: '2. Morada de Envio (Portugal)',
      profile_badge_priority: 'ENVIO PRIORITÁRIO 24H',
      profile_lbl_address: 'Morada Completa (Rua, Avenida, Praça)',
      profile_lbl_apt: 'Andar / Bloco / Porta',
      profile_lbl_zip: 'Código Postal (Formato PT: XXXX-XXX)',
      profile_lbl_city: 'Cidade / Distrito',
      profile_lbl_country: 'País',
      profile_sec3_title: '3. Histórico de Grails & Pedidos Bespoke',
      profile_badge_records: '2 REGISTOS CRIPTOGRÁFICOS',
      profile_order_delivered: 'ENTREGUE',
      profile_order1_sub: 'Tamanho EU 42 · Certificado NFC Criptográfico Ativo',
      profile_btn_view_nfc: 'Ver Certificado NFC',
      profile_order_crafting: 'EM CONFEÇÃO',
      profile_order2_sub: 'Tamanho EU 42 · Costura Manual no Atelier de Lisboa',
      profile_btn_track: 'Seguir Criação',
      profile_sec4_title: '4. Preferências do Atelier & Segurança',
      profile_badge_system: 'SISTEMA',
      profile_pref_audio_title: 'Efeitos Sonoros do Atelier (Audio Feedback)',
      profile_pref_audio_desc: 'Sons mecânicos e acústica de alta fidelidade ao interagir com cores e sapatilhas.',
      profile_pref_3d_title: 'Renderização Tridimensional WebGL',
      profile_pref_3d_desc: 'Ativar iluminação e física de levitação interativa 3D em tempo real.',
      profile_pref_notify_title: 'Alertas Prioritários de Drops Deadstock',
      profile_pref_notify_desc: 'Notificações instantâneas 10 minutos antes de novos lançamentos de Air Jordan 1 de 1985.',
      profile_btn_reset: 'Restaurar Padrões',
      profile_btn_logout: 'Terminar Sessão',
      profile_btn_save: 'Guardar Configurações',

      // Extended Footer Keys
      footer_brand_desc: 'A plataforma definitiva de custódia e criação para colecionadores de ténis raros. Experiência de visualização imersiva, autenticação forense em 14 pontos físicos e preservação deadstock com chip NFC criptográfico.',
      footer_link_manifesto: 'Sobre Nós / O Manifesto',
      footer_link_timeline: 'De Onde Viemos (Timeline)',
      footer_link_mission: 'A Nossa Missão',
      footer_link_pillars: 'Os 4 Pilares Forenses',
      footer_link_nfc: 'Verificador NFC',
      footer_link_booking: 'Marcar Visita no Atelier',
      footer_link_profile: 'Painel de Colecionador / Perfil',
      footer_link_wishlist: 'A Minha Wishlist ❤️',
      footer_link_signin: 'Sign In (Acesso ao Cofre)',
      footer_link_register: 'Registar Conta de Colecionador',
      footer_link_cart: 'Ver Saco de Compras',
      footer_copyright_text: '© 2026 ARQUIVO AETHER KICKS. Todos os direitos reservados. Lisboa & Porto, Portugal.',
      footer_craft_text: 'Artesanato Bespoke, Proteção Criptográfica & Custódia Deadstock.'
    },
    en: {
      // Navigation
      nav_runway: 'Runway',
      nav_grid: 'Grid',
      nav_lab: 'Bespoke Lab',
      nav_drops: 'Drops',
      nav_analytics: 'Analytics',
      nav_about: 'About Us',
      nav_audio: 'AUDIO',
      nav_wishlist: 'WISHLIST',
      nav_bag: 'BAG',
      nav_profile: 'Profile',
      nav_signin: 'Sign In',
      nav_join_vault: 'Join Vault',
      nav_perf_on: 'PERF: ON',
      nav_perf_off: 'ULTRA: ON',
      drawer_perf_mode: 'Performance Mode',
      toast_perf_on: 'Performance Mode: ON ⚡ (60-120 FPS)',
      toast_perf_off: 'Cinematic Ultra Mode: ON 🎨 (Continuous Colors)',
      nav_menu_title: 'Archive Menu',
      presentation_mode: 'Presentation Mode',
      drawer_language: 'Language / Idioma',
      audio_atmosphere: 'Atmospheric Sound',

      // Hamburger Menu Links
      menu_01: 'Runway Archive',
      menu_02: 'The Grail Vault',
      menu_03: 'Bespoke Lab',
      menu_04: 'Live Drops',
      menu_05: 'Market Analytics',
      menu_06: 'About Us',
      menu_07: 'Your Wishlist',
      menu_08: 'Collector Profile',
      menu_09: 'NFC Verification',
      menu_footer_auth: 'AUTHENTICATED SNEAKERHEAD ARCHIVE © 2026',

      // Square Grid Vault Section
      catalog_badge: 'CATALOG ARCHIVE',
      catalog_title: 'THE GRAIL VAULT',
      catalog_desc: 'Explore our authenticated high-top lineage in a clean square grid format or switch back to the immersive colorway runway anytime.',
      ask_price: 'ASK PRICE',
      in_stock: 'IN STOCK',
      instant_buy: 'Instant Buy',
      instant_buy_now: 'Instant Buy Now',
      view_runway: 'View Runway',
      save_wishlist: 'Save to Wishlist',

      // Runway Stages & Badges
      badge_drop_01: 'DROP 01 • DEADSTOCK',
      badge_drop_02: 'DROP 02 • DEADSTOCK',
      badge_drop_03: 'DROP 03 • DEADSTOCK',
      badge_drop_04: 'DROP 04 • DEADSTOCK',
      badge_drop_05: 'DROP 05 • DEADSTOCK',
      badge_drop_06: 'DROP 06 • DEADSTOCK',
      badge_deadstock: 'DEADSTOCK 100%',
      badge_heritage: 'HERITAGE',
      badge_atelier: '1-OF-1 ATELIER',

      // Spec Table Labels & Hotspots
      spec_style_code: 'STYLE CODE',
      spec_original_year: 'ORIGINAL YEAR',
      spec_upper_leather: 'UPPER LEATHER',
      spec_cushioning: 'CUSHIONING',
      spec_leather_vachetta: 'Full-Grain Vachetta',
      spec_leather_tumbled: 'Amethyst Tumbled Leather',
      spec_leather_nubuck: 'Carolina Nubuck Suede',
      spec_leather_grain: 'Rich Full-Grain Leather',
      spec_leather_museum: 'Museum-Grade Backboard Leather',
      spec_leather_blackcat: 'Graphite Triple Black Nubuck',
      spec_cushion_air: 'Encapsulated Air',
      spec_hotspot_highcut: 'OG 1985 HIGH CUT',
      spec_hotspot_air: 'ENCAPSULATED AIR',
      spec_hotspot_leather: 'PREMIUM LEATHER',
      spec_hotspot_wings: 'DEBOSSED WINGS LOGO',
      spec_hotspot_outsole: 'OG CONCENTRIC TRACTION',

      // Shoe Descriptions / Stories (Runway)
      story_chicago: 'The sneaker that sparked a global revolution. Fined $5,000 per game by David Stern, Michael Jordan wore them anyway. The defining grail of footwear culture.',
      story_purple: 'Regal intensity. Clean white quarter panels balanced with rich amethyst tumbled leather and pitch-black framing accents.',
      story_blue: 'Homage to MJ\'s alma mater. Powder sky blue nubuck enveloped in Tar Heel pride with stark Obsidian overlays.',
      story_green: 'Bold emerald swagger with gym red tongue tab accents on pitch black grain leather.',
      story_orange: 'Inspired by the 1985 exhibition game in Italy where MJ broke the backboard glass into shards with a historic slam dunk.',
      story_shadow: 'The stealth icon inspired by MJ\'s fierce nickname. Crafted with rich black nubuck, matte netting, and blacked-out hardware.',

      // Buy Card Controls
      market_trend: 'Market Trend',
      select_size: 'Select Size',
      selected_prefix: 'Selected:',
      add_to_bag: 'Add to Bag',
      inspect_specs: 'Inspect Specifications & Story',
      guarantee_auth: 'Forensic Physical Authentication',
      guarantee_shipping: 'Express 48h Delivery',

      // Marquee Ribbon
      marquee_100: '100% VERIFIED DEADSTOCK',
      marquee_nfc: 'PHYSICAL & DIGITAL NFC AUTHENTICATION',
      marquee_delivery: 'EXPRESS 2-DAY PRIORITY DELIVERY',
      marquee_lineup: 'CHICAGO • COURT PURPLE • UNIVERSITY BLUE • PINE GREEN',
      marquee_vault: 'THE SNEAKERHEAD ARCHIVE VAULT',
      marquee_noreps: 'NO REPLICAS EVER PERMITTED',

      // Vault Catalog Section (#catalog-vault)
      catalog_vault_badge: 'THE FULL DROP ARCHIVE',
      catalog_vault_title: 'Vault Catalog',
      catalog_vault_desc: 'Explore authenticated iconic colorways, compare current market valuations, and lock down your grail.',
      filter_all: 'All Grails (6)',
      filter_red: 'Chicago Red',
      filter_purple: 'Court Purple',
      filter_blue: 'University Blue',
      filter_green: 'Pine Green',
      filter_orange: 'Shattered',
      starting_at: 'STARTING AT',
      buy_now: 'Buy Now',
      story_chicago_short: 'The defining 1985 classic in premium full-grain leather and varsity red finish.',
      story_purple_short: 'Regal amethyst paneling with stark white and pitch-black balance.',
      story_blue_short: 'Powder sky blue nubuck honoring Michael Jordan university alma mater.',
      story_green_short: 'Pine green textured grain with gym red tongue tag accents.',
      story_orange_short: 'Museum-grade leather celebrating the iconic 1985 backboard shattering game.',
      story_shadow_short: 'Stealth triple black silhouette in soft nubuck with matte ventilation netting.',

      // 3D Turntable HUD
      turntable_auto: 'Auto 360°',
      turntable_pause: 'Pause 360°',
      turntable_side: 'Side',
      turntable_34: '3/4 View',
      turntable_aerial: 'Aerial',
      turntable_heel: 'Heel',
      turntable_sole: 'Sole',

      // Bespoke Lab & Studio
      lab_badge: 'AETHER BESPOKE LAB',
      lab_title: 'BESPOKE COLOR LAB',
      lab_desc: 'Customize leather panels in real-time 3D or preview technical blueprints from our Lisbon Atelier.',
      lab_mode_studio: '3D Studio',
      lab_mode_blueprint: 'Technical Blueprint',
      lab_material_preset: 'MATERIAL PRESET',
      lab_select_part: 'SELECT COMPONENT',
      lab_panel_base: 'Base Upper',
      lab_panel_overlay: 'Overlay Panels',
      lab_panel_swoosh: 'Swoosh',
      lab_panel_collar: 'Collar',
      lab_panel_laces: 'Laces',
      lab_panel_sole: 'Outsole',
      lab_leather_finish: 'LEATHER FINISH',
      lab_finish_matte: 'Matte Leather',
      lab_finish_patent: 'Gloss Patent',
      lab_finish_distressed: 'Distressed Vintage',
      lab_engraving_title: 'CUSTOM LASER ENGRAVING',
      lab_engraving_placeholder: 'Engrave your monogram or tag (e.g. GRAIL-01)',
      lab_unit_selector: 'UNIT:',
      lab_btn_reset: 'Reset Baseline',
      lab_btn_save: 'Save Design',
      lab_btn_order: 'Order 1-of-1 Bespoke',

      // Live Drops HUD
      drops_badge: 'RELEASE CALENDAR',
      drops_title: 'LIVE VAULT DROPS',
      drops_next_drop: 'Next Drop:',
      drops_timer_days: 'DAYS',
      drops_timer_hours: 'HOURS',
      drops_timer_mins: 'MINS',
      drops_timer_secs: 'SECS',
      drops_raffle_badge: 'RAFFLE EARLY ACCESS',
      drops_shoes_remaining: 'PAIRS REMAINING',
      drops_entrants: 'ENTRANTS REGISTERED',
      drops_allocation: 'VERIFIED ALLOCATION',
      drops_enter_raffle: 'Enter Cryptographic Raffle',
      drops_msrp_badge: 'MSRP $190 (Est. Resale $1,450)',

      // Market Analytics
      analytics_badge: 'MARKET TELEMETRY',
      analytics_title: 'MARKET VALUATION INDEX',
      analytics_hero_title: 'Air Jordan 1 Chicago Valuation Index',
      analytics_trend_positive: '+28.6% OVER PAST YEAR',
      analytics_volatility: '30D Volatility',
      analytics_liquidity: 'Liquidity Score',
      analytics_market_cap: 'Vault Portfolio Value',
      analytics_historical_sales: 'HISTORICAL SALES',
      analytics_avg_margin: 'AVERAGE APPRECIATION MARGIN',
      analytics_live_trades: 'LIVE VAULT TRANSACTIONS',

      // Bag / Cart Drawer
      cart_title: 'Collector Bag',
      cart_empty_title: 'Your bag is currently empty',
      cart_empty_desc: 'Explore the color runway and lock down your preferred grail.',
      cart_explore_showcase: 'Explore Showcase',
      cart_subtotal: 'Subtotal',
      cart_shipping: 'Insured Express Delivery',
      cart_shipping_free: 'Complimentary',
      cart_total: 'Estimated Total',
      cart_checkout: 'Proceed to Checkout',
      cart_promo_placeholder: 'Promo Code (e.g. GRAIL20)',
      cart_promo_apply: 'Apply',

      // NFC Verification Modal
      nfc_modal_title: 'Cryptographic NFC Authentication',
      nfc_modal_desc: 'Hold your smartphone or reader near the encrypted NFC tag embedded in the sneaker tongue.',
      nfc_status_ready: 'Ready for scanning...',
      nfc_btn_scan: 'Begin NFC Verification',
      nfc_step_1: '1. Hold reader to tongue',
      nfc_step_2: '2. Cryptographic key check',
      nfc_step_3: '3. Custody certificate issued',

      // Buy Modal & Checkout
      buy_modal_title: 'Instant Grail Reservation',
      buy_modal_subtitle: 'Forensic authentication guaranteed and physical custody with insured priority shipping.',
      checkout_step1: '1. Shipping Details',
      checkout_step2: '2. Payment Method',
      checkout_confirm: 'Confirm Insured Order',

      // About Us Page
      about_hero_badge: 'HISTORIC ARCHIVE & BESPOKE ATELIER · EST. 2026',
      about_hero_title: 'The AETHER KICKS Manifesto',
      about_hero_desc: 'Where high-precision footwear craftsmanship intersects forensic validation and deadstock preservation.',
      about_section_title: 'From Underground Pavement to Curatorial Vanguard',
      about_pillar_01_title: 'Non-Negotiable Authenticity',
      about_pillar_02_title: '1-of-1 Bespoke Craftsmanship',
      about_pillar_03_title: 'Sneaker Culture Preservation',
      about_pillar_04_title: 'Digital & NFC Custody',

      // Profile & Wishlist Pages
      profile_title: 'Collector Profile & Vault Status',
      profile_hero_badge: 'COLLECTOR MANAGEMENT CENTER · LISBON ATELIER',
      profile_hero_title: 'Profile Settings',
      profile_hero_desc: 'Manage your priority shipping details, standard shoe size, delivery address, and authenticated order history.',
      wishlist_title: 'Your Authenticated Wishlist',
      wishlist_hero_badge: 'PERSONAL SNEAKER VAULT · GRAIL LIST',
      wishlist_hero_title: 'Your Grail Wishlist',
      wishlist_hero_desc: 'The world\'s most coveted pairs locked on your radar. Reserve, instantly purchase, or customize at our Bespoke Atelier.',

      // Auth (Login & Register)
      auth_chicago_badge: 'CHICAGO RETRO 1985 ACCESS',
      auth_purple_badge: 'COURT PURPLE 2020 REGISTRATION',
      login_title: 'Welcome Back',
      login_subtitle: 'Sign in to unlock verified collector drops, private bidding, and guaranteed authentic grails.',
      login_email_label: 'Sneakerhead Email or Tag',
      login_password_label: 'Password',
      login_remember_me: 'Remember me on this device',
      login_submit_btn: 'Unlock Private Vault',
      login_no_account: 'New collector to the archive?',
      login_register_link: 'Create Deadstock Account →',
      register_title: 'Join The Archive',
      register_subtitle: 'Create your collector identity to secure priority allocation and private drops.',
      register_fullname_label: 'Collector Full Name',
      register_email_label: 'Official Email Address',
      register_password_label: 'Create Password',
      register_size_label: 'Preferred Shoe Size',
      register_terms_label: 'I agree to Forensic Authentication Terms and Vault Drop Rules',
      register_submit_btn: 'Create Collector Account',
      register_already_registered: 'Already registered in the vault?',
      register_login_link: 'Sign In Here →',
      // Additional Storefront & Modal Keys
      badge_limited_01: 'LIMITED DROP 01',
      badge_limited_02: 'LIMITED DROP 02',
      badge_limited_03: 'LIMITED DROP 03',
      badge_limited_04: 'LIMITED DROP 04',
      badge_limited_05: 'LIMITED DROP 05',
      badge_limited_06: 'LIMITED DROP 06',
      badge_royal_amethyst: 'ROYAL AMETHYST',
      badge_tar_heel: 'TAR HEEL HERITAGE',
      badge_stealth_emerald: 'STEALTH EMERALD',
      badge_italy_exhibition: 'ITALY EXHIBITION',
      badge_stealth_grail: 'STEALTH GRAIL',
      spec_release_era: 'RELEASE ERA',
      spec_leather_grade: 'LEATHER GRADE',
      spec_outsole: 'OUTSOLE',
      spec_collaboration: 'COLLABORATION',
      spec_material: 'MATERIAL',
      spec_inner_lining: 'INNER LINING',
      spec_texture: 'TEXTURE',
      spec_tongue_tag: 'TONGUE TAG',
      spec_nickname: 'NICKNAME',
      spec_sail_midsole: 'SAIL MIDSOLE',
      spec_insole_graphic: 'INSOLE GRAPHIC',
      spec_silhouette: 'SILHOUETTE',
      spec_upper_material: 'UPPER MATERIAL',
      lab_heading: 'Design Your 1-of-1 Grail',
      lab_subheading: 'Take full artistic direction over authentic Jordan silhouettes. Select panels, craft signature colorways, and mint custom physical-digital pairs directly to your bag.',
      lab_studio_mode: 'Photorealistic Studio',
      lab_blueprint_mode: 'Design Blueprint',
      lab_label_component: 'Select Component to Color',
      lab_label_swatches: 'Curated Heritage Color Swatches',
      lab_label_size: 'Bespoke Size / Tamanho',
      lab_commission: 'BESPOKE COMMISSION',
      lab_add_bag: 'Add 1-of-1 to Bag',
      drops_next_global: 'NEXT GLOBAL DROP',
      drops_tier0: 'TIER 0 ALLOCATION',
      drops_hours: 'Hours',
      drops_minutes: 'Minutes',
      drops_seconds: 'Seconds',
      drops_millisec: 'Millisec',
      drops_verified_sha: '🔒 Verified via SHA-256 Entropy Ledger',
      analytics_live_market: 'LIVE SECONDARY MARKET',
      analytics_1yr: '1 Year',
      analytics_6mo: '6 Months',
      analytics_all: 'All Time',
      analytics_median_val: 'Current Median Value',
      analytics_12m_appreciation: '12-Month Appreciation',
      analytics_30d_liquidity: '30-Day Liquidity Vol.',
      analytics_volatility_idx: 'Vault Volatility Index',
      checkout_modal_badge: 'CRYPTOGRAPHIC ENCRYPTED CHECKOUT',
      checkout_modal_title: 'Complete Your Order',
      checkout_modal_desc: 'Guaranteed deadstock pair reserved in vault for 10 minutes.',
      checkout_shipping_name: 'Full Shipping Name',
      checkout_street_address: 'Street Address',
      checkout_city_state: 'City, State',
      checkout_postal_code: 'Postal Code',
      checkout_payment_method: 'Select Payment Method',
      checkout_pay_btn: 'Lock Down Grail & Pay',
      nfc_sensor_active: 'CRYPTOGRAPHIC SENSOR ACTIVE',
      nfc_hold_device: 'Hold Device Near Sneaker Tongue',
      nfc_interrogating: 'Interrogating micro-antenna RFID/NFC cryptographic security chip...',
      nfc_status_querying: 'STATUS: QUERYING DECENTRALIZED PROOF OF AUTHENTICITY...',
      nfc_verified_badge: 'VERIFIED ORIGINAL GRAIL',
      nfc_verified_title: '100% Guaranteed Authentic',
      nfc_done_btn: 'Verification Complete',
      raffle_badge: 'LIMITED BALLOT',
      raffle_desc: 'Sign the cryptographic raffle ticket. Winners will be notified with instant checkout rights.',
      raffle_collector_name: 'Collector Name',
      raffle_email: 'Email Address',
      raffle_select_size: 'Select Preferred Size',
      raffle_btn: 'Lock In Balloting Entry',
      about_section_badge: 'THE MANIFESTO & ARCHIVE HERITAGE',
      about_heading: 'Where Street Culture Meets Forensic Precision.',
      about_lead_desc: 'Founded by obsessive collectors and digital craftspeople, AETHER KICKS bridges the raw nostalgia of 1985 hardwood grails with hyper-modern interactive digital archiving. We believe every pair tells a cultural milestone that deserves forensic verification, flawless climate preservation, and frictionless collector custody.',
      about_pillar_1_title: '12-Point Forensic Check',
      about_pillar_1_desc: 'Spectroscopy, UV luminescence, stitch density audits, and micro-text verification conducted by veteran footwear curators.',
      about_pillar_2_title: 'Cryptographic NFC Chips',
      about_pillar_2_desc: 'Every physical silhouette is tagged with an encrypted NFC chip linking directly to decentralized immutable provenance ledgers.',
      about_pillar_3_title: 'Sub-Zero Vault Custody',
      about_pillar_3_desc: 'Archived deadstock grails rest in climate, UV, and humidity-stabilized vaults at 52°F to prevent polyurethane oxidation.',
      about_pillar_4_title: 'Secondary Liquidity',
      about_pillar_4_desc: 'Real-time marketplace price indices, historical trend analysis, and instant guaranteed buyback for authenticated pairs.',
      about_btn_manifesto: 'Discover Manifesto & Complete History',
      about_btn_visit: 'Visit The Atelier',
      about_stat_auth: 'Authenticity Guarantee',
      about_stat_grails: 'Grails Verified & Shipped',
      about_stat_forensic: 'Forensic Physical Audit',
      about_stat_counterfeit: 'Counterfeit Tolerance',
      footer_tagline: 'The definitive luxury platform for verified grails. Experience high-resolution drops, real-time authenticated custody, and dynamic chromatic colorways.',
      footer_col_runway: 'Runway Colorways',
      footer_col_atelier: 'Atelier & Authentication',
      footer_col_membership: 'Collector Membership',
      footer_copyright: '© 2026 AETHER KICKS ARCHIVE. All rights reserved.',
      footer_built: 'Designed with HTML5, CSS3, & Modern Vanilla JavaScript.',
      back_storefront: 'Back to Storefront',

      // Extended About Page Keys
      about_page_title: 'About Us | AETHER KICKS - Atelier Manifesto & Sneakerhead Archive',
      about_bc_vault: 'The Vault',
      about_bc_atelier: 'Atelier',
      about_bc_current: 'About Us & Manifesto',
      about_hero_badge_alt: 'ATELIER MANIFESTO · EST. 2021',
      about_main_hero_title: 'Born in the Underground.<br>Crafted for Grail Collectors.',
      about_main_hero_desc: 'An unyielding bridge between the raw 1985 court nostalgia and high-precision bespoke craftsmanship. We curate footwear history and handcraft wearable art.',
      about_cta_explore: 'Explore The Grail Vault',
      about_specimen_badge: 'OG SPECIMEN #001',
      about_deadstock_badge: 'DEADSTOCK ARCHIVE',
      about_spec_matrix: 'BASE SILHOUETTE',
      about_spec_matrix_val: 'Air Jordan 1 High (1985 Cut)',
      about_spec_cert: 'CERTIFICATION',
      about_spec_cert_val: '14 Forensic Points + NFC',
      about_origins_eyebrow: 'OUR ORIGINS · FROM LISBON & PORTO TO THE WORLD',
      about_origins_headline: 'From Underground Pavement to Curatorial Vanguard.',
      about_origins_desc: "What began as a quiet obsession with time-aged yellowed soles has evolved into Europe's most exclusive grail preservation and bespoke atelier.",
      about_origins_lead: "AETHER KICKS wasn't born in a corporate boardroom. It was forged on the cobblestone pavements of Bairro Alto and the historic alleys of Chiado in Lisbon, where sneakerheads traded holy grails out of car trunks beneath the amber glow of streetlamps.",
      about_origins_p1: 'By 2021, footwear culture was flooded with soulless bots, instantaneous digital raffles, and an unprecedented epidemic of near-flawless counterfeit replicas. The sacred essence of the "Grail" — the patient, passionate hunt for authentic footwear history — was slipping away.',
      about_origins_p2: "We decided to build the antidote: a physical and digital sanctuary where every silhouette is handled with the reverence of a Renaissance masterwork. We anchored our initial vault with 40 pristine deadstock 1985 pairs and partnered with generational master cordwainers in northern Portugal, combining centuries of artisanal leather craftsmanship with the world's most coveted hardwood grails.",
      about_origins_quote: '"An authentic grail is not merely pressed rubber and leather; it is a living cultural time capsule. Our sacred duty is to preserve it with surgical rigor for future generations."',
      about_origins_author: '— DIOGO V. & AETHER CURATORIAL GUILD',
      about_time_2021_loc: 'Chiado, Lisbon',
      about_time_2021_title: 'The Secret Chiado Vault',
      about_time_2021_desc: 'Acquisition of the foundational private archive of 40 deadstock 1985 pairs. Installation of our first climate-stabilized, barometric dehumidification chamber.',
      about_time_2023_loc: 'Porto Atelier Lab',
      about_time_2023_title: 'Bespoke Atelier & OG Restoration',
      about_time_2023_desc: "Inauguration of the craft workshop in Porto's Arts District. First bespoke 1-of-1 hand-stitched silhouettes crafted with Tuscan vegetable leathers and preserved donor soles.",
      about_time_2025_loc: 'Forensic Laboratory',
      about_time_2025_title: 'AETHER Tag™ Cryptographic Protocol',
      about_time_2025_desc: 'Introduction of tamper-evident NFC security microchips embedded in the tongue of every specimen, bonding physical grails to immutable cryptographic provenance ledgers.',
      about_time_2026_loc: 'AETHER Global Runway',
      about_time_2026_title: 'Chromatic Runway & Vault Liquidity',
      about_time_2026_desc: 'Launch of the real-time interactive runway showroom, lifetime authenticity guarantee with instant buyback liquidity, and insured priority dispatches across Europe.',
      about_mission_eyebrow: 'PURPOSE & PRINCIPLES · THE SACRED TENETS',
      about_mission_headline: 'Our Mission: Redefining Grail Custody.',
      about_mission_desc: 'We exist to eradicate uncertainty in the high-value footwear market through three non-negotiable principles.',
      about_tenet_1_title: 'Non-Negotiable Authenticity',
      about_tenet_1_desc: "Zero tolerance for replicas or dubious provenance. Every silhouette accepted into our vault undergoes an intensive 14-point forensic manual audit, UV spectroscopic glue inspection, and tamper-evident NFC sealing. If it isn't 100% pure deadstock, it never enters.",
      about_tenet_1_tag: '14-POINT FORENSIC AUDIT · ZERO TOLERANCE',
      about_tenet_2_title: '1-of-1 Bespoke Craftsmanship',
      about_tenet_2_desc: 'We never mass-produce. Our atelier laboratory constructs singular bespoke commissions using certified full-grain leathers from Italy and Portugal, hand-stitched with waxed German threads across archival 1985 high-top lasts.',
      about_tenet_2_tag: 'HERITAGE EUROPEAN LEATHERS · ARTISANAL CRAFT',
      about_tenet_3_title: 'Sneaker Culture Preservation',
      about_tenet_3_desc: 'Historic sneakers are milestones of industrial design and counterculture that demand museum-grade conservation. Our 16°C climate and humidity-stabilized chambers halt polyurethane hydrolysis and rubber oxidation for decades.',
      about_tenet_3_tag: 'DEADSTOCK CLIMATE CHAMBER · ANTI-HYDROLYSIS SHIELD',
      about_pillars_eyebrow: 'FORENSIC PROTECTION SYSTEM · THE 4 PILLARS',
      about_pillars_headline: 'The 4 Pillars of Absolute Authenticity.',
      about_pillars_desc: 'A four-tier protocol merging veteran human curatorial expertise with state-of-the-art cryptographic hardware.',
      about_pillar_1_head: '1. Forensic Micro-Inspection',
      about_pillar_1_body: '50x microscopic stitch density analysis (8.5 stitches/inch), full-grain leather thickness gauging, and UV luminescence spectroscopy to detect modern chemical adhesives.',
      about_pillar_1_badge: 'PHYSICAL AUDIT · 14 POINTS',
      about_pillar_2_head: '2. NFC Digital Certificate',
      about_pillar_2_body: 'High-security NTAG cryptographic microchip embedded beneath the woven tongue label. Tapping any modern smartphone validates the tamper-proof SHA-256 custody ledger.',
      about_pillar_2_badge: 'IMMUTABLE SHA-256 NFC CHIP',
      about_pillar_3_head: '3. Sub-Zero Climate Vault',
      about_pillar_3_body: 'Prior to courier dispatch, all deadstock grails rest in our dedicated vault maintained at 16°C, 48% relative humidity, HEPA air filtration, and total UV shielding.',
      about_pillar_3_badge: 'VAULT CUSTODY UNTIL DISPATCH',
      about_pillar_4_head: '4. Lifetime Guarantee & Buyback',
      about_pillar_4_body: 'Every pair carries an irrevocable contractual authenticity warranty: if refuted by any accredited forensic authority, we refund 200%. We also guarantee instant market-rate buybacks.',
      about_pillar_4_badge: '200% REFUND + INSTANT LIQUIDITY',
      about_proc_eyebrow: 'STEP-BY-STEP CRAFTSMANSHIP · THE ATELIER LAB',
      about_proc_headline: 'The Atelier Process: From Matrix to Grail.',
      about_proc_desc: 'Discover the rigorous artisanal intervention cycle applied to every bespoke commission and curated historic grail.',
      about_step_1_num: 'STEP 01',
      about_step_1_title: 'OG Base Sourcing',
      about_step_1_desc: 'Meticulous screening of authentic matrix specimens and preserved vintage donor soles. Structural verification of polyurethane midsoles and encapsulated air units.',
      about_step_1_spec: 'CRITERIA: 100% DEADSTOCK OR PRISTINE VINTAGE',
      about_step_2_num: 'STEP 02',
      about_step_2_title: 'Decontamination & Prep',
      about_step_2_desc: 'Surgical deconstruction with seam release, cryogenic dry-ice sanitization to extract microscopic contaminants, and re-lasting over archival 1985 anatomical molds.',
      about_step_2_spec: 'PROCESS: CRYOGENIC CLEANING & 1985 LAST',
      about_step_3_num: 'STEP 03',
      about_step_3_title: 'Hand-Dyeing & Bench Stitching',
      about_step_3_desc: 'Hand-clicking Tuscan full-grain leather hides, precision UV-stable pigment finishing, and single-needle artisan stitching with high-tensile waxed German thread.',
      about_step_3_spec: 'MATERIALS: ITALIAN LEATHER & WAXED THREAD',
      about_step_4_num: 'STEP 04',
      about_step_4_title: 'Finishing & NFC Cryptographic Seal',
      about_step_4_desc: 'Natural organic beeswax waterproofing, encasement of the encrypted NFC micro-transponder beneath the tongue, final 14-point audit, and smoked acrylic box encasement.',
      about_step_4_spec: 'DISPATCH: SMOKED ACRYLIC + NFC CERTIFICATE',
      about_stat_delivered: 'Grails Delivered Across Portugal & Europe',
      about_stat_auth_rate: 'Flawless Authenticity Rate',
      about_stat_express: 'Hand-Delivered Insured Priority Shipping',
      about_stat_vip_score: 'VIP Collector Satisfaction Rating',
      about_concierge_eyebrow: 'PRIVATE SALONS & COMMISSIONS · CONTACT & BOOKING',
      about_concierge_headline: 'Step Into Our Atelier. Consult Our Curators.',
      about_concierge_desc: 'Our physical salon in Lisbon and craft lab in Porto welcome collectors by private appointment for archival inspection, portfolio advisory, or bespoke 1-of-1 commissions.',
      about_studio_lisbon_tag: 'LISBON CONCEPT STUDIO',
      about_studio_lisbon_name: 'AETHER Vault Chiado',
      about_studio_lisbon_addr: 'Rua da Prata 142, 2nd Floor<br>1100-420 Lisbon, Portugal',
      about_studio_lisbon_hours: 'Monday to Saturday: 10:00 - 19:30 (Private Appointment Only)',
      about_studio_porto_tag: 'PORTO ATELIER LAB',
      about_studio_porto_name: 'AETHER Bespoke Workshop',
      about_studio_porto_addr: 'Rua de Miguel Bombarda 285<br>4050-377 Porto, Portugal',
      about_studio_porto_hours: 'Tuesday to Friday: 11:00 - 19:00 (Craftsmanship Studio Tours)',
      about_form_title: 'Book Private Consultation or Bespoke Commission',
      about_form_desc: 'Submit your details below to schedule an in-person atelier salon or initiate a custom 1-of-1 design commission. A curator will respond within 4 hours.',
      about_form_lbl_name: 'Collector Full Name',
      about_form_ph_name: 'e.g. Gonçalo Matos',
      about_form_lbl_email: 'Contact Email Address',
      about_form_ph_email: 'collector@example.com',
      about_form_lbl_phone: 'Phone / WhatsApp',
      about_form_ph_phone: '+351 91X XXX XXX',
      about_form_lbl_type: 'Consultation Purpose',
      about_opt_bespoke: '1-of-1 Bespoke Atelier Commission',
      about_opt_lisbon: 'Private Tour of Lisbon Vault',
      about_opt_porto: 'Technical Tour of Porto Lab',
      about_opt_sourcing: 'Specific Grail Sourcing & Acquisition',
      about_opt_auth: 'Forensic Authentication of Personal Pair',
      about_form_lbl_details: 'Project Details / Silhouette of Interest',
      about_form_ph_details: 'Describe the silhouette, shoe size (US/EU), desired customizations, or preferred appointment date...',
      about_form_btn_submit: 'Submit Request to VIP Concierge',
      nfc_cipher_status: 'STATUS: CRYPTOGRAPHIC SYSTEM ACTIVE • SHA-256',
      nfc_close_btn: 'Close Scanner',

      // Extended Wishlist Keys
      wishlist_page_title: 'Grail Wishlist | AETHER KICKS - Personal Sneaker Vault',
      wishlist_loading: 'Loading saved grails...',
      wishlist_saved_single: 'Grail Saved',
      wishlist_saved_plural: 'Grails Saved',
      wishlist_stat_vault: 'Lisbon Deadstock Vault',
      wishlist_stat_nfc: 'NFC Verified',
      wishlist_empty_title: 'Your Grail Vault is Empty',
      wishlist_empty_desc: 'You have not yet archived any pairs in your personal radar. Explore our colorway runway and preserve your sacred silhouettes.',
      wishlist_empty_btn: 'Explore 1985 Vault Runway →',
      select_size_eu: 'Select Size (EU / PT):',
      add_pair_bag: 'Add Pair to Bag',
      cart_discount: 'Promo Discount',
      wishlist_remove_title: 'Remove from Wishlist',
      profile_toast_saved: '✅ Profile saved successfully! Synced with Atelier.',
      profile_confirm_reset: 'Do you want to reset default collector settings?',
      profile_confirm_logout: 'Do you want to sign out from the collector vault?',
      profile_toast_logout: 'Signed out. Redirecting...',
      checkout_pay_credit: 'Credit Card',
      checkout_discount_label: 'Grail Discount (20% OFF):',
      checkout_shipping_label: 'Priority Express Shipping:',
      checkout_total_label: 'Total to Pay:',

      // Extended Profile Keys
      profile_page_title: 'Profile Settings | AETHER KICKS - Collector Dashboard',
      profile_tier_patron: 'TIER 1 · VAULT PATRON',
      profile_stat_portfolio: 'PORTFOLIO VALUE',
      profile_stat_collection: 'ACTIVE COLLECTION',
      profile_tab_personal: 'Personal Info & Sizing',
      profile_tab_shipping: 'Shipping Address',
      profile_tab_orders: 'Order History',
      profile_tab_security: 'Security & Atelier',
      profile_sec1_title: '1. Personal Information & Size Preferences',
      profile_badge_auth: 'AUTHENTICATED',
      profile_lbl_fullname: 'Full Name',
      profile_lbl_tag: 'Collector Tag',
      profile_lbl_email: 'Notification Email',
      profile_lbl_phone: 'Mobile / WhatsApp Contact (Portugal)',
      profile_lbl_default_size: 'Default Sneaker Size',
      profile_size_note: '* Selected size will be pre-filled during instant checkout and Bespoke Atelier customizers.',
      profile_sec2_title: '2. Priority Shipping Address (Portugal)',
      profile_badge_priority: '24H PRIORITY SHIPPING',
      profile_lbl_address: 'Street Address (Street, Avenue, Building)',
      profile_lbl_apt: 'Apartment / Suite / Unit',
      profile_lbl_zip: 'Postal Code (Format: XXXX-XXX)',
      profile_lbl_city: 'City / District',
      profile_lbl_country: 'Country',
      profile_sec3_title: '3. Grail Archive & Bespoke History',
      profile_badge_records: '2 CRYPTOGRAPHIC RECORDS',
      profile_order_delivered: 'DELIVERED',
      profile_order1_sub: 'Size EU 42 · Cryptographic NFC Certificate Active',
      profile_btn_view_nfc: 'View NFC Certificate',
      profile_order_crafting: 'IN BENCH CRAFTING',
      profile_order2_sub: 'Size EU 42 · Hand-Stitched at Lisbon Atelier',
      profile_btn_track: 'Track Crafting',
      profile_sec4_title: '4. Atelier Experience & Security Preferences',
      profile_badge_system: 'SYSTEM',
      profile_pref_audio_title: 'Atelier Sound Atmosphere (Audio Feedback)',
      profile_pref_audio_desc: 'Haptic acoustic feedback and mechanical effects during colorway changes.',
      profile_pref_3d_title: '3D WebGL Realtime Rendering',
      profile_pref_3d_desc: 'Enable real-time dynamic studio lighting and levitation physics.',
      profile_pref_notify_title: 'Priority Deadstock Drop Alerts',
      profile_pref_notify_desc: 'Instant notification broadcasts 10 minutes prior to new 1985 OG releases.',
      profile_btn_reset: 'Reset Defaults',
      profile_btn_logout: 'Sign Out',
      profile_btn_save: 'Save Settings',

      // Extended Footer Keys
      footer_brand_desc: 'The definitive custody and bespoke creation platform for rare footwear collectors. Immersive runway experience, 14-point forensic physical authentication, and NFC deadstock preservation.',
      footer_link_manifesto: 'About Us / The Manifesto',
      footer_link_timeline: 'Our Origins (Timeline)',
      footer_link_mission: 'Our Mission & Tenets',
      footer_link_pillars: 'The 4 Forensic Pillars',
      footer_link_nfc: 'NFC Verification',
      footer_link_booking: 'Book Atelier Appointment',
      footer_link_profile: 'Collector Dashboard / Profile',
      footer_link_wishlist: 'My Grail Wishlist ❤️',
      footer_link_signin: 'Sign In (Vault Access)',
      footer_link_register: 'Register Collector Account',
      footer_link_cart: 'View Collector Bag',
      footer_copyright_text: '© 2026 AETHER KICKS ARCHIVE. All rights reserved. Lisbon & Porto, Portugal.',
      footer_craft_text: 'Bespoke Craftsmanship, Cryptographic Protection & Deadstock Custody.'
    }
  };

  class I18nManager {
    constructor() {
      var stored = localStorage.getItem('aether_language');
      if (stored === 'pt' || stored === 'en') {
        this.currentLang = stored;
      } else {
        var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        this.currentLang = browserLang.startsWith('en') ? 'en' : 'pt';
      }
    }

    init() {
      this.applyTranslations(this.currentLang);
      this.updateSwitcherUI();
    }

    t(key) {
      var dict = translations[this.currentLang] || translations.pt;
      return dict[key] || (translations.en[key] || key);
    }

    setLanguage(lang) {
      if (lang !== 'pt' && lang !== 'en') return;
      this.currentLang = lang;
      localStorage.setItem('aether_language', lang);
      document.documentElement.lang = lang;
      this.applyTranslations(lang);
      this.updateSwitcherUI();

      if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
        window.soundEngine.playClick();
      }

      if (window.cartManager && typeof window.cartManager.renderCartItems === 'function') {
        window.cartManager.renderCartItems();
      }

      window.dispatchEvent(new CustomEvent('aether:languageChange', { detail: { lang: lang } }));
    }

    toggleLanguage() {
      var next = this.currentLang === 'pt' ? 'en' : 'pt';
      this.setLanguage(next);
      if (typeof window.showToast === 'function') {
        window.showToast(next === 'pt' ? 'Idioma: Português (PT)' : 'Language: English (EN)');
      }
    }

    updateSwitcherUI() {
      var btns = document.querySelectorAll('.btn-lang-toggle');
      var lang = this.currentLang;
      btns.forEach(function (btn) {
        var ptSpan = btn.querySelector('[data-lang="pt"]');
        var enSpan = btn.querySelector('[data-lang="en"]');
        if (ptSpan) ptSpan.classList.toggle('active', lang === 'pt');
        if (enSpan) enSpan.classList.toggle('active', lang === 'en');
        btn.setAttribute('aria-label', lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese');
        btn.setAttribute('title', lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese');
      });
    }

    translateElement(rootEl) {
      if (!rootEl) return;
      var dict = translations[this.currentLang] || translations.pt;

      if (rootEl.hasAttribute && rootEl.hasAttribute('data-i18n')) {
        var key = rootEl.getAttribute('data-i18n');
        if (dict[key]) {
          if (rootEl.tagName === 'TITLE') {
            document.title = dict[key];
          } else if (dict[key].indexOf('<') !== -1 && dict[key].indexOf('>') !== -1) {
            rootEl.innerHTML = dict[key];
          } else {
            rootEl.textContent = dict[key];
          }
        }
      }

      var elements = rootEl.querySelectorAll('[data-i18n]');
      elements.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) {
          if (el.tagName === 'TITLE') {
            document.title = dict[key];
          } else if (dict[key].indexOf('<') !== -1 && dict[key].indexOf('>') !== -1) {
            el.innerHTML = dict[key];
          } else {
            el.textContent = dict[key];
          }
        }
      });

      var placeholders = rootEl.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
      });

      var titles = rootEl.querySelectorAll('[data-i18n-title]');
      titles.forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (dict[key]) el.title = dict[key];
      });
    }

    applyTranslations(lang) {
      var dict = translations[lang] || translations.pt;
      document.documentElement.lang = lang;

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) {
          if (el.tagName === 'TITLE') {
            document.title = dict[key];
          } else if (dict[key].indexOf('<') !== -1 && dict[key].indexOf('>') !== -1) {
            el.innerHTML = dict[key];
          } else {
            el.textContent = dict[key];
          }
        }
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
          el.placeholder = dict[key];
        }
      });

      document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (dict[key]) {
          el.title = dict[key];
        }
      });
    }
  }

  window.i18n = new I18nManager();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.i18n.init();
    });
  } else {
    window.i18n.init();
  }
})();
