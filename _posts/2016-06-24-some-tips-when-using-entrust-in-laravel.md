---
layout: post
title:  "Some Tips when using Entrust in Laravel"
excerpt: "Tips collection about using Entrust in Laravel"
date:   2016-06-24 07:18:00 +0700
categories: laravel
tags: laravel entrust
---

I got the problem when using `bican/roles` Role module in my Laravel project.

There is an error when I check permission.

So I decided to move `zizaco/entrust` and tested all features working normal.

## How to install Entrust

#### Install use composer

```bash
$ composer require zizaco/entrust:5.2.x-dev
```

#### Setting to `config/app.php`

Add bellow line to `providers` array in `config/app.php`.

```php
    Zizaco\Entrust\EntrustServiceProvider::class,
```

Add bellow line to `aliases` array in `config/app.php`.

```php
    'Entrust' => Zizaco\Entrust\EntrustFacade::class,
```

#### Setting to `app/Http/Kernal.php`

Add bellow lines to `routeMiddleware` array in `app/Http/Kernal.php`.

```php
    'role' => \Zizaco\Entrust\Middleware\EntrustRole::class,
    'permission' => \Zizaco\Entrust\Middleware\EntrustPermission::class,
    'ability' => \Zizaco\Entrust\Middleware\EntrustAbility::class,
```

#### Publish `entrust.php` file

```bash
$ php artisan vendor:publish
```

## Database Setup

#### Generate Entrust migration

```bash
$ php artisan entrust:migration
```

It will generate the `<timestamp>_entrust_setup_tables.php` migration.

Execute migration

```bash
$ php artisan migrate
```

## Trouble shootings

#### Error when execute migration

After create `<timestamp>_entrust_setup_tables.php`, you have to write your users table in this file. Open `<timestamp>_entrust_setup_tables.php` file and write name of users table to `28 line`.

```php
    $table->foreign('user_id')->references('id')->on('users')
        ->onUpdate('cascade')->onDelete('cascade');
```

#### This cache store does not support tagging

Set `CACHE_DRIVER=array` in `.env` file.

* [https://github.com/Zizaco/entrust/issues/541](https://github.com/Zizaco/entrust/issues/541)

#### Error when delete role

In Laravel 5.2, error is occured when delete role. Because Entrust get User class using `Config::get('auth.model')`.

EntrustRoleTrait.php file

```php
    /**
     * Many-to-Many relations with the user model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(Config::get('auth.model'), Config::get('entrust.role_user_table'),Config::get('entrust.role_foreign_key'),Config::get('entrust.user_foreign_key'));
       // return $this->belongsToMany(Config::get('auth.model'), Config::get('entrust.role_user_table'));
    }
```

So We have to return right user model by that position. There are two solutions for this.

##### 1. Change EntrustRoleTrait.php file to use correct configuration value.

We can change `Config::get('auth.model')` to `Config::get('auth.providers.users.model')`. Laravel 5.2 already have users model information in that position.

##### 2. Add `auth.model` value to config/auth.php file

We can also add new value to config/auth.php file to allow Entrust get rights value.

```php
return [
  ...

  /**
   * Add this configuration for Entrust
   */
  'model' => App\User::class,
];
```