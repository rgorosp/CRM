-- ============================================================
--  Tabela de contatos do CRM
--  Rodar UMA VEZ. Rodar de novo insere os 10 contatos outra vez.
-- ============================================================

CREATE TABLE IF NOT EXISTS contatocrm (
  -- Número único de cada contato, gerado pelo banco
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,

  -- Obrigatório: sem nome não existe contato
  nome           VARCHAR(120) NOT NULL,

  -- Opcionais: nem todo contato chega com tudo preenchido
  email          VARCHAR(160) NULL,
  telefone       VARCHAR(20)  NULL,

  -- Etapa do funil. O banco só aceita estes quatro valores.
  -- Quem não informar entra como 'novo'.
  etapa          ENUM('novo', 'em contato', 'proposta', 'cliente')
                 NOT NULL DEFAULT 'novo',

  anotacoes      TEXT NULL,

  -- Preenchida sozinha pelo banco no momento do cadastro
  data_cadastro  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  -- Acelera a contagem por etapa (o painel do funil vai usar isso)
  KEY idx_etapa (etapa)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
--  10 contatos de exemplo
--  Repare: 'data_cadastro' não aparece na lista de campos.
--  É o banco que preenche.
-- ------------------------------------------------------------

INSERT INTO contatocrm (nome, email, telefone, etapa, anotacoes) VALUES
('Ana Beatriz Ferreira',  'ana.ferreira@example.com',   '(11) 98812-4470', 'novo',       'Chegou pelo formulário do site. Ainda não foi contatada.'),
('Carlos Eduardo Nunes',  'carlos.nunes@example.com',   '(21) 99145-2208', 'em contato', 'Ligação feita em 03/09. Pediu para retornar na próxima semana.'),
('Mariana Lopes Duarte',  'mariana.duarte@example.com', '(31) 98330-7712', 'proposta',   'Proposta enviada por e-mail. Aguardando retorno do financeiro dela.'),
('Roberto Silva Campos',  'roberto.campos@example.com', '(11) 97741-9903', 'cliente',    'Fechou contrato anual. Renovação prevista para setembro do ano que vem.'),
('Juliana Martins Alves', 'juliana.alves@example.com',  '(41) 99628-1145', 'novo',       'Indicação do Roberto Campos.'),
('Fernando Aparecido Rocha', NULL,                      '(51) 98457-3390', 'em contato', 'Só tem WhatsApp, não passou e-mail. Prefere contato à tarde.'),
('Patrícia Gomes Ribeiro','patricia.ribeiro@example.com', NULL,            'novo',       'Preencheu o formulário mas deixou o telefone em branco.'),
('Thiago Menezes Barros', 'thiago.barros@example.com',  '(61) 98123-5567', 'proposta',   'Achou o valor alto. Vai comparar com concorrente antes de decidir.'),
('Luciana Prado Teixeira','luciana.teixeira@example.com','(85) 99012-4433','em contato', 'Reunião marcada. Quer entender melhor o funcionamento.'),
('Marcos Antônio Vieira', 'marcos.vieira@example.com',  '(48) 98876-2201', 'cliente',    'Cliente antigo, voltou a comprar. Pagamento sempre em dia.');
