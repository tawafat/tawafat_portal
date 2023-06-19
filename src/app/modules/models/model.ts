export interface LocationDetails {
    id?: number;
    name?: string;
    city?: string;
    country?: string;
    address: string;
    long: string;
    lat: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UpdatedBy {
    id: number;
    name: string;
    email: string;
    email_verified_at?: any;
    created_at: Date;
    updated_at: Date;
}

export interface CreatedBy {
    id: number;
    name: string;
    email: string;
    email_verified_at?: any;
    created_at: Date;
    updated_at: Date;
}

export interface Job {
    id?: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    enable_gps?: boolean;
    type?:string;
    enable_studio?: boolean;
    location_id?: number;
    assigned_to_id?: any;
    created_by_id?: number;
    updated_by_id?: number;
    created_at?: Date;
    updated_at?: Date;
    location: LocationDetails;
    assigned_to?: Employee;
    updated_by?: UpdatedBy;
    created_by?: CreatedBy;
    complains?: Complain[],
    job_detail?: JobDetail;
    // radius: string,
}

export interface JobDetail{
    id: number;
    job_id: number;
    job_type: string;
    no_of_packages?: number | null;
    rejected_packages?: number | null;
    min_weight?: number | null;
    gate_number?: string | null;
    no_entering?: number | null;
    no_exiting?: number | null;
    no_inside?: number | null;
    camp_number?: string | null;
    temperature?: number | null;
    humidity?: number | null;
    date_time: string;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface JobType{
    id: string;
    name_ar: string;
    slug: string;
}

export interface Category {
    id: number;
    slug: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    action: string;
}

export interface Employee {
    id?: number;
    name: string;
    password?: string;
    password_confirmation?: string;
    email?: string;
    email_verified_at?: any;
    role_id?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Complain {
    id: number;
    comment: string;
    attachment_id: string;
    attachmentType?: any;
    job_id: string;
    created_by_id: string;
    created_at: Date;
    updated_at: Date;
    attachment_url: string;
    job: Job;
    created_by: CreatedBy;
}

export interface Password{
    old_password: string,
    password: string,
    password_confirmation: string
}

export interface Attachment{
    id: number;
    name: string;
    type: string;
    url: string;
    size: string;
    folder: string;
    note: string;
    description?: any;
    created_by_id: number;
    counter: number;
    created_at: Date;
    updated_at: Date;
}

export interface Pie{
    total: string,
    inactive: string,
    active: string,
    completed: string,
    cancelled: string,
}

export interface Graph{
    dates: Date,
    total: string,
}

export interface Dashboard{
    graph: Graph[],
    pie: Pie,
}
