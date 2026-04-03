import { CityRepository } from "@/backend/domain/repositories/CityRepository";
import { City } from "@/backend/domain/entities/City";
import { SupabaseClient } from "@supabase/supabase-js";
import { getImageUrl } from "@/utils/supabase/imageUtils";

interface ImageRecord {
  storage_path: string;
  public_url?: string;
}
interface CityTable {
  id: number;
  name: string;
  description: string;
  image_id: number;
  images?: ImageRecord | null;
}

export class SbCityRepository implements CityRepository {
  constructor(private supabase: SupabaseClient) { }

  private mapToCity(cityTable: CityTable): City {
    return new City(
      cityTable.id,
      cityTable.name,
      cityTable.description,
      getImageUrl(cityTable.images)
    );
  }

  async getCityById(id: number): Promise<City | null> {
    const { data, error } = await this.supabase
      .from("cities")
      .select(`
        id,
        name,
        description,
        image_id,
        images:image_id (
          storage_path,
          public_url
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return this.mapToCity(data as unknown as CityTable);
  }

  async getAllCities(): Promise<City[]> {
    const { data, error } = await this.supabase
      .from("cities")
      .select(`
        id,
        name,
        description,
        image_id,
        images:image_id (
          storage_path,
          public_url
        )
      `)
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((city) => this.mapToCity(city as unknown as CityTable));
  }
}
