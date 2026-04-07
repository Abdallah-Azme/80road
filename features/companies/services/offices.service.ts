import api from '@/lib/api-client';
import { Office, OfficeSchema } from '@/lib/types';
import { CompanyDepartment, DepartmentsResponse } from '../types';

// ── Service functions ─────────────────────────────────────────

/**
 * Fetch all company departments.
 */
export async function fetchDepartments(): Promise<CompanyDepartment[]> {
  try {
    const response = await api.get<DepartmentsResponse>('/companies/departments');
    if (response.status) return response.data;
    return [];
  } catch (error) {
    console.error('[Offices Service] Error fetching departments:', error);
    return [];
  }
}

interface RawOfficeResponse {
  id: number;
  name: string;
  image: string;
  state: string | null;
  ads_count: number;
  rate: number;
}

/**
 * Fetch offices, optionally filtered by category name/id.
 */
export async function fetchOffices(category?: string | number): Promise<Office[]> {
  try {
    const url = category ? `/companies/departments/${category}` : '/explore';
    const resp = await api.get<{ status: boolean; data: RawOfficeResponse[] }>(url);
    
    if (resp.status && resp.data) {
      return resp.data.map((raw) => ({
        id: raw.id,
        officeName: raw.name,
        logo: raw.image,
        governorate: raw.state ?? undefined,
        activeListingsCount: raw.ads_count,
        rating: raw.rate,
        sampleListings: [],
      })).map(item => OfficeSchema.parse(item));
    }
    return [];
  } catch (error) {
    console.error('[Offices Service] Error fetching offices:', error);
    return [];
  }
}

export async function fetchOfficeById(id: string | number): Promise<Office | null> {
  try {
    const response = await api.get<{status: boolean; data: unknown}>(`/profile/${id}`);
    if (response.status && response.data) {
       return OfficeSchema.parse(response.data);
    }
    return null;
  } catch (err) {
    console.error(`[Offices Service] Error fetching office ${id}:`, err);
    return null;
  }
}
