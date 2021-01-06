CREATE TABLE public.vinculo_token_device
(
  id serial,
  token character varying COLLATE pg_catalog."default",
  os character varying COLLATE pg_catalog."default",
  id_usuario integer,
  criado timestamp with time zone DEFAULT now(),
  atualizado timestamp with time zone DEFAULT now(),
  controle boolean DEFAULT false,
  CONSTRAINT vinculo_token_device_pkey PRIMARY KEY (id)
)

BEGIN
NEW.atualizado:=now();
RETURN NEW;
END;


CREATE TRIGGER up
BEFORE UPDATE 
ON public.vinculo_token_device
FOR EACH ROW
EXECUTE PROCEDURE public.set_update();