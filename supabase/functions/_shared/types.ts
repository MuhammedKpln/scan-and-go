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
          id: number
          token: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          token?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          id?: number
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
          }
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
          }
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          expire_at: string
          id: number
          tagId: string | null
          userId: string
        }
        Insert: {
          content: string
          created_at?: string
          expire_at: string
          id?: number
          tagId?: string | null
          userId: string
        }
        Update: {
          content?: string
          created_at?: string
          expire_at?: string
          id?: number
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
          }
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
          }
        ]
      }
      phone_numbers: {
        Row: {
          created_at: string
          id: number
          number: string
          userId: string
        }
        Insert: {
          created_at?: string
          id?: number
          number: string
          userId: string
        }
        Update: {
          created_at?: string
          id?: number
          number?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_phone_numbers_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_phoneNumbers_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          }
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
          id: number
          twitter: string | null
          updated_at: string
          userId: string | null
        }
        Insert: {
          id?: number
          twitter?: string | null
          updated_at?: string
          userId?: string | null
        }
        Update: {
          id?: number
          twitter?: string | null
          updated_at?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_social_media_accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          isAvailable: boolean | null
          name: string
          note: string
          userId: string
        }
        Insert: {
          created_at?: string
          id?: string
          isAvailable?: boolean | null
          name: string
          note: string
          userId: string
        }
        Update: {
          created_at?: string
          id?: string
          isAvailable?: boolean | null
          name?: string
          note?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_tags_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
