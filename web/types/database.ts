/**
 * Supabase 스키마 타입.
 *
 * 이 파일은 손으로 작성한 초기 버전이다. 마이그레이션을 원격에 적용한 뒤
 * 아래 명령으로 실제 스키마 기준으로 재생성한다:
 *
 *   npm run db:types
 *
 * (내부적으로 `supabase gen types typescript --linked` 실행)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "influencer" | "brand" | "admin";
export type EntityStatus = "active" | "inactive" | "pending";
export type CampaignStatus = "draft" | "recruiting" | "closed" | "completed";
export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "matched";
export type MatchStatus =
  | "matched"
  | "in_progress"
  | "completed"
  | "cancelled";
export type CompensationType =
  | "paid"
  | "free_product"
  | "commission"
  | "mixed";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          name: string | null;
          avatar_url: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          user_id: string;
          role: UserRole;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      influencers: {
        Row: {
          id: string;
          profile_id: string;
          nickname: string | null;
          xiaohongshu_id: string | null;
          xiaohongshu_url: string | null;
          follower_count: number;
          categories: string[];
          collaboration_types: string[];
          bio: string | null;
          avatar_url: string | null;
          status: EntityStatus;
        } & Timestamps;
        Insert: {
          id?: string;
          profile_id: string;
          nickname?: string | null;
          xiaohongshu_id?: string | null;
          xiaohongshu_url?: string | null;
          follower_count?: number;
          categories?: string[];
          collaboration_types?: string[];
          bio?: string | null;
          avatar_url?: string | null;
          status?: EntityStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["influencers"]["Insert"]>;
        Relationships: [];
      };
      influencer_contacts: {
        Row: {
          id: string;
          influencer_id: string;
          wechat_id: string | null;
          email: string | null;
          phone: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          influencer_id: string;
          wechat_id?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["influencer_contacts"]["Insert"]
        >;
        Relationships: [];
      };
      brands: {
        Row: {
          id: string;
          profile_id: string;
          brand_name: string | null;
          logo_url: string | null;
          description: string | null;
          category: string | null;
          website: string | null;
          status: EntityStatus;
        } & Timestamps;
        Insert: {
          id?: string;
          profile_id: string;
          brand_name?: string | null;
          logo_url?: string | null;
          description?: string | null;
          category?: string | null;
          website?: string | null;
          status?: EntityStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      brand_contacts: {
        Row: {
          id: string;
          brand_id: string;
          contact_name: string | null;
          contact_wechat: string | null;
          contact_phone: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          brand_id: string;
          contact_name?: string | null;
          contact_wechat?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["brand_contacts"]["Insert"]
        >;
        Relationships: [];
      };
      campaigns: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          product_name: string | null;
          category: string | null;
          description: string | null;
          platform: string | null;
          recruitment_count: number;
          minimum_followers: number;
          creator_categories: string[];
          compensation_type: CompensationType | null;
          compensation_detail: string | null;
          budget: number | null;
          product_provided: boolean;
          content_requirements: string | null;
          recruit_start_date: string | null;
          recruit_end_date: string | null;
          collab_start_date: string | null;
          collab_end_date: string | null;
          cover_image_url: string | null;
          status: CampaignStatus;
        } & Timestamps;
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          product_name?: string | null;
          category?: string | null;
          description?: string | null;
          platform?: string | null;
          recruitment_count?: number;
          minimum_followers?: number;
          creator_categories?: string[];
          compensation_type?: CompensationType | null;
          compensation_detail?: string | null;
          budget?: number | null;
          product_provided?: boolean;
          content_requirements?: string | null;
          recruit_start_date?: string | null;
          recruit_end_date?: string | null;
          collab_start_date?: string | null;
          collab_end_date?: string | null;
          cover_image_url?: string | null;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey";
            columns: ["brand_id"];
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      applications: {
        Row: {
          id: string;
          campaign_id: string;
          influencer_id: string;
          message: string | null;
          strengths: string | null;
          past_collaboration: string | null;
          portfolio_links: string[];
          performance_summary: string | null;
          status: ApplicationStatus;
        } & Timestamps;
        Insert: {
          id?: string;
          campaign_id: string;
          influencer_id: string;
          message?: string | null;
          strengths?: string | null;
          past_collaboration?: string | null;
          portfolio_links?: string[];
          performance_summary?: string | null;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["applications"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "applications_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_influencer_id_fkey";
            columns: ["influencer_id"];
            referencedRelation: "influencers";
            referencedColumns: ["id"];
          },
        ];
      };
      matches: {
        Row: {
          id: string;
          campaign_id: string;
          influencer_id: string;
          application_id: string | null;
          status: MatchStatus;
          matched_at: string;
          completed_at: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          campaign_id: string;
          influencer_id: string;
          application_id?: string | null;
          status?: MatchStatus;
          matched_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "matches_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_influencer_id_fkey";
            columns: ["influencer_id"];
            referencedRelation: "influencers";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      landing_stats: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

export type Profile = Tables<"profiles">;
export type Influencer = Tables<"influencers">;
export type InfluencerContact = Tables<"influencer_contacts">;
export type Brand = Tables<"brands">;
export type BrandContact = Tables<"brand_contacts">;
export type Campaign = Tables<"campaigns">;
export type Application = Tables<"applications">;
export type Match = Tables<"matches">;
