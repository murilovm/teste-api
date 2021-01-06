CREATE TABLE public.usuario
(
    id serial,
    email text COLLATE pg_catalog."default" NOT NULL,
    nome text COLLATE pg_catalog."default",
    telefone text COLLATE pg_catalog."default",
    cpf text COLLATE pg_catalog."default",
    senha text COLLATE pg_catalog."default",
    id_facebook text COLLATE pg_catalog."default",
    foto text COLLATE pg_catalog."default",
    admin boolean NOT NULL DEFAULT false,
    ativo boolean NOT NULL DEFAULT true,
    foto_large text COLLATE pg_catalog."default",
    genero text COLLATE pg_catalog."default",
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    nascimento date,
    CONSTRAINT usuario_pk PRIMARY KEY (id),
    CONSTRAINT usuario_cpf_key UNIQUE (cpf),
    CONSTRAINT usuario_id_facebook_key UNIQUE (id_facebook),
)


/* FUNÇÃO DE UPDATE*/
BEGIN
NEW.atualizado:=now();
RETURN NEW;
END;


CREATE TRIGGER up
BEFORE UPDATE 
ON public.usuario
FOR EACH ROW
EXECUTE PROCEDURE public.set_update();