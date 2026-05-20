from services.supabase_client import supabase

def get_companies():

    response = supabase.table("companies").select("*").execute()

    return response.data