-- ============================================================
--  Duas regras de cadastro, aplicadas pelo próprio banco
--  Rodar UMA VEZ. Rodar de novo dá erro de "já existe" — sem problema.
-- ============================================================

-- ------------------------------------------------------------
--  Regra 1 — não deixar o mesmo e-mail entrar duas vezes
--
--  Um índice UNIQUE faz o banco recusar o segundo cadastro com o
--  mesmo e-mail. Contato sem e-mail continua permitido à vontade:
--  no MySQL, o UNIQUE não conta os campos vazios (NULL).
--
--  A comparação ignora maiúsculas (é a collation da tabela),
--  então "Ana@x.com" e "ana@x.com" são tratados como o mesmo e-mail.
-- ------------------------------------------------------------
ALTER TABLE contatocrm
  ADD CONSTRAINT uk_contatocrm_email UNIQUE (email);


-- ------------------------------------------------------------
--  Regra 2 — todo contato precisa de pelo menos uma forma de falar
--            com a pessoa: e-mail ou telefone
--
--  Sem isso, dá para salvar um nome solto — um registro que nasce
--  inútil. O CHECK recusa a gravação quando os dois estão vazios.
--  Vale tanto para vazio de verdade (NULL) quanto para texto em
--  branco ('').
-- ------------------------------------------------------------
ALTER TABLE contatocrm
  ADD CONSTRAINT ck_contatocrm_meio_de_contato
  CHECK (
    (email    IS NOT NULL AND email    <> '') OR
    (telefone IS NOT NULL AND telefone <> '')
  );
