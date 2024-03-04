export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      fcm_tokens: {
        Row: {
          created_at: string
          id: string
          token: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          token?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          token?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_fcm_tokens_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          fromId: string
          id: string
          message: string
          read_at: string | null
          roomId: string
          toId: string
        }
        Insert: {
          created_at?: string
          fromId?: string
          id?: string
          message: string
          read_at?: string | null
          roomId: string
          toId?: string
        }
        Update: {
          created_at?: string
          fromId?: string
          id?: string
          message?: string
          read_at?: string | null
          roomId?: string
          toId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_messages_fromId_fkey"
            columns: ["fromId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_roomId_fkey"
            columns: ["roomId"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_toId_fkey"
            columns: ["toId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          expire_at: string
          id: string
          tagId: string | null
          userId: string
        }
        Insert: {
          content: string
          created_at?: string
          expire_at: string
          id?: string
          tagId?: string | null
          userId: string
        }
        Update: {
          content?: string
          created_at?: string
          expire_at?: string
          id?: string
          tagId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_notes_tagId_fkey"
            columns: ["tagId"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_notes_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          fromUserId: string
          id: string
          toUserId: string
          type: number
        }
        Insert: {
          body?: string | null
          created_at?: string
          fromUserId: string
          id?: string
          toUserId: string
          type?: number
        }
        Update: {
          body?: string | null
          created_at?: string
          fromUserId?: string
          id?: string
          toUserId?: string
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_fromUserId_fkey"
            columns: ["fromUserId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_toUserId_fkey"
            columns: ["toUserId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          created_at: string
          id: string
          number: string
        }
        Insert: {
          created_at?: string
          id: string
          number: string
        }
        Update: {
          created_at?: string
          id?: string
          number?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          firstName: string
          id: string
          lastName: string
          profileImageUrl: string | null
          sendMessageAllowed: boolean
          showPhoneNumber: boolean
        }
        Insert: {
          bio?: string | null
          created_at?: string
          firstName: string
          id: string
          lastName: string
          profileImageUrl?: string | null
          sendMessageAllowed?: boolean
          showPhoneNumber?: boolean
        }
        Update: {
          bio?: string | null
          created_at?: string
          firstName?: string
          id?: string
          lastName?: string
          profileImageUrl?: string | null
          sendMessageAllowed?: boolean
          showPhoneNumber?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          id: string
          users: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          users?: string[]
        }
        Update: {
          created_at?: string
          id?: string
          users?: string[]
        }
        Relationships: []
      }
      social_media_accounts: {
        Row: {
          id: string
          twitter: string | null
          updated_at: string
        }
        Insert: {
          id: string
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          twitter?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_accounts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          isActive: boolean
          isAvailable: boolean
          name: string | null
          note: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          isActive?: boolean
          isAvailable?: boolean
          name?: string | null
          note?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          isActive?: boolean
          isAvailable?: boolean
          name?: string | null
          note?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_rooms_with_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          users: string[]
          profiles: Json
        }[]
      }
      get_rooms_with_users_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          users: string[]
          profiles: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

