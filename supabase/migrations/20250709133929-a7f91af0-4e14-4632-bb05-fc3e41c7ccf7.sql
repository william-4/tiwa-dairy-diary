-- Update user_roles table to make first user admin and subsequent users admin by default
-- Also update the trigger to default new users to admin role
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- All new users default to admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$function$;