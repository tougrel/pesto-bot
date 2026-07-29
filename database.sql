-- Tables
create table if not exists CheckType
(
    type_id   int(2)      not null
        primary key,
    type_name varchar(24) not null
);

create table if not exists CheckValue
(
    value_id    int auto_increment,
    type_id     int(2)      not null,
    user_id     varchar(20) not null comment 'The user''s discord id',
    check_value int         not null,
    created_at  bigint      not null,
    expires_at  bigint      not null,
    primary key (value_id, type_id, user_id),
    constraint CheckValue_CheckType_type_id_fk
        foreign key (type_id) references CheckType (type_id)
            on update cascade
);

create table if not exists Wallet
(
    id          varchar(20)      not null comment 'The user''s discord id'
        primary key,
    coins       int    default 0 not null,
    total_coins bigint default 0 not null
);

create table if not exists WalletHistory
(
    id         varchar(20)      not null comment 'The user''s discord id',
    type       varchar(20)      not null,
    coins      bigint default 0 not null,
    created_at bigint           not null,
    expires_at bigint           not null
);

create table if not exists GambaGames
(
    game_id   int(2) auto_increment
    primary key,
    game_name varchar(128) not null,
    constraint game_name
    unique (game_name)
);

create table if not exists GambaHistory
(
    gamba_pull_id int auto_increment
    primary key,
    user_id       varchar(20) not null,
    game_id       int(2)      not null,
    did_pulls_on  bigint      not null,
    poor_until    bigint      not null,
    debuff_used   tinyint(1)  not null,
    constraint GambaHistory_GambaGames_game_id_fk
    foreign key (game_id) references GambaGames (game_id)
    on update cascade on delete cascade
);

create table if not exists GambaToPesto
(
    game_id int(2)      not null,
    user_id varchar(20) not null,
    constraint user_id
    unique (user_id, game_id),
    constraint GambaToPesto_GambaGames_game_id_fk
    foreign key (game_id) references GambaGames (game_id)
    on update cascade on delete cascade
);

-- Views

create view if not exists AllChecks as
select `CV`.`user_id`                                                AS `user_id`,
       max(case when `CV`.`type_id` = 0 then `CV`.`check_value` end) AS `pp_power`,
       max(case when `CV`.`type_id` = 0 then `CV`.`expires_at` end)  AS `pp_expires`,
       max(case when `CV`.`type_id` = 1 then `CV`.`check_value` end) AS `clueless_power`,
       max(case when `CV`.`type_id` = 1 then `CV`.`expires_at` end)  AS `clueless_expires`,
       max(case when `CV`.`type_id` = 2 then `CV`.`check_value` end) AS `copium_power`,
       max(case when `CV`.`type_id` = 2 then `CV`.`expires_at` end)  AS `copium_expires`,
       max(case when `CV`.`type_id` = 3 then `CV`.`check_value` end) AS `horni_power`,
       max(case when `CV`.`type_id` = 3 then `CV`.`expires_at` end)  AS `horni_expires`,
       max(case when `CV`.`type_id` = 4 then `CV`.`check_value` end) AS `mango_power`,
       max(case when `CV`.`type_id` = 4 then `CV`.`expires_at` end)  AS `mango_expires`,
       max(case when `CV`.`type_id` = 5 then `CV`.`check_value` end) AS `feet_power`,
       max(case when `CV`.`type_id` = 5 then `CV`.`expires_at` end)  AS `feet_expires`
from `Pesto`.`CheckValue` `CV`
where `CV`.`expires_at` = (select max(`Pesto`.`CheckValue`.`expires_at`)
                           from `Pesto`.`CheckValue`
                           where `Pesto`.`CheckValue`.`user_id` = `CV`.`user_id`
                             and `Pesto`.`CheckValue`.`type_id` = `CV`.`type_id`)
group by `CV`.`user_id`;

create view if not exists TheCouncil as
select `Pesto`.`CheckValue`.`user_id`                                                                      AS `user_id`,
       round(avg(if(`Pesto`.`CheckValue`.`check_value` = -1, 100, `Pesto`.`CheckValue`.`check_value`)),
             2)                                                                                            AS `avg_power`,
       count(0)                                                                                            AS `total_rolls`,
       round(avg(least(if(`Pesto`.`CheckValue`.`check_value` = -1, 100, `Pesto`.`CheckValue`.`check_value`), 100)) *
             log10(count(0) + 1), 2)                                                                       AS `score`,
       if(`Pesto`.`CheckValue`.`user_id` in (124963012321738752, 236642620506374145), 1, 0)                AS `is_king`
from `Pesto`.`CheckValue`
where `Pesto`.`CheckValue`.`expires_at` >=
      unix_timestamp(date_format(curdate() - interval 1 month, '%Y-%m-01 00:00:00')) * 1000
  and `Pesto`.`CheckValue`.`expires_at` < unix_timestamp(date_format(curdate(), '%Y-%m-01 00:00:00')) * 1000
group by `Pesto`.`CheckValue`.`user_id`
having count(0) >= 20
order by if(`Pesto`.`CheckValue`.`user_id` in (124963012321738752, 236642620506374145), 1, 0) desc,
         round(avg(least(if(`Pesto`.`CheckValue`.`check_value` = -1, 100, `Pesto`.`CheckValue`.`check_value`), 100)) *
               log10(count(0) + 1), 2) desc;
