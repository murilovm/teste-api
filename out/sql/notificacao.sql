CREATE TABLE public.notificacao
(
    id serial,
    title text COLLATE pg_catalog."default",
    id_usuario integer,
    criado timestamp with time zone DEFAULT now(),
    status integer DEFAULT 3,
    todos boolean,
    body character varying COLLATE pg_catalog."default",
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT notificacao_fk0 FOREIGN KEY (id_usuario)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
)
-- Index: fki_notificacao_fk0


CREATE INDEX fki_notificacao_fk0
ON public.notificacao USING btree
(id_usuario)
TABLESPACE pg_default;

/* FUNÇÃO DE UPDATE*/
BEGIN
NEW.atualizado:=now();
RETURN NEW;
END;


CREATE TRIGGER up
BEFORE UPDATE
ON public.notificacao
FOR EACH ROW
EXECUTE PROCEDURE public.set_update();
