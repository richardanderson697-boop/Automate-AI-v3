export type UserRole = 'admin' | 'cashier' | 'inventory_manager' | 'mechanic'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  created_at: string
  updated_at: string
}

export interface Part {
  id: string
  sku: string
  name: string
  description?: string
  category: string
  manufacturer?: string
  model_compatibility?: string[]
  quantity: number
  reorder_level: number
  unit_price: number
  cost_price: number
  location?: string
  barcode?: string
  image_url?: string
  created_at: string
  updated_at: string
  created_by: string
}

export interface Sale {
  id: string
  sale_number: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  subtotal: number
  tax: number
  discount: number
  total: number
  payment_method: 'cash' | 'card' | 'check' | 'other'
  payment_status: 'pending' | 'completed' | 'refunded'
  status: 'draft' | 'completed' | 'cancelled'
  notes?: string
  cashier_id: string
  created_at: string
  updated_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  part_id: string
  quantity: number
  unit_price: number
  discount: number
  total: number
  part?: Part
}

export interface WorkOrder {
  id: string
  work_order_number: string
  customer_name: string
  customer_phone?: string
  customer_email?: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_year?: number
  vehicle_vin?: string
  vehicle_mileage?: number
  problem_description: string
  diagnosis?: string
  labor_cost: number
  parts_cost: number
  tax: number
  total: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  estimated_completion?: string
  actual_completion?: string
  mechanic_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface WorkOrderPart {
  id: string
  work_order_id: string
  part_id: string
  quantity: number
  unit_price: number
  part?: Part
}

export interface AIDiagnostic {
  id: string
  work_order_id?: string
  input_type: 'audio' | 'image' | 'text'
  input_data: string
  ai_response: string
  diagnosis_summary?: string
  recommended_parts?: string[]
  estimated_cost?: number
  confidence_score?: number
  created_by: string
  created_at: string
}

export interface InventoryTransaction {
  id: string
  part_id: string
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'return'
  quantity: number
  reference_id?: string
  notes?: string
  created_by: string
  created_at: string
  part?: Part
}
