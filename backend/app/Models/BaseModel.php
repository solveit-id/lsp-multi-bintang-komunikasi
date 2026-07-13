<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasPublicUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class BaseModel extends Model
{
    use HasFactory;
    use HasPublicUuid;
    use SoftDeletes;

    /**
     * Seluruh model wajib mendefinisikan
     * atribut yang dapat diisi secara eksplisit
     * menggunakan #[Fillable] atau $fillable.
     *
     * BaseModel tidak menetapkan $guarded
     * agar setiap model bertanggung jawab
     * terhadap mass assignment-nya sendiri.
     */
}
