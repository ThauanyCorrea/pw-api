-- criar um banco de dados chamado trabalho_api

-- criar as tabelas

create table cursos (
codigo serial not null primary key, 
nome varchar(50) not null);

create table alunos (
codigo serial not null primary key,
nome varchar(50) not null,  
curso integer not null, 
foreign key (curso) references cursos (codigo));

insert into cursos (nome) values ('Ciencia da Computação'), ('Engenharia da Computação');

insert into alunos (nome, curso) values ('Thauany Martins', 1), ('João Lima', 2), ('Robson', 1);

select * from cursos