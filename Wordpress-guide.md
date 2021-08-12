
# Tabla de contenidos

-   [Crear un sitio Wordpress desde 0](#crear-un-sitio-wordpress-desde-0)
-   [Crear custom types](#crear-custom-types)
    -   [Consideraciones previas](#consideraciones-previas)
        -   [Fragmento de código para nuestro nuevo post type](#fragmento-de-c-digo-para-nuestro-nuevo-post-type)
    -   [Agregar información adicional en tu cabecera del post](#agregar-informaci-n-adicional-en-tu-cabecera-del-post)
        -   [( útil para información importante, links o ayudas)](#---til-para-informaci-n-importante--links-o-ayudas-)
    -   [Categorias y etiquetas](#categorias-y-etiquetas)
-   [Esconder o elimianar default post type](#esconder-o-elimianar-default-post-type)
    -   [Menú lateral](#menu-lateral)
    -   [Admin bar](#admin-bar)
        -   [The "+" New post](#the-----new-post)
        -   [The "+" New Link](#the-----new-link)
    -   [The Quick Draft Dashboard Widget](#the-quick-draft-dashboard-widget)
-   [Crear un custom plugin](#crear-un-custom-plugin)
-   [Crear custom templates para tu archivo de custom posts types](#crear-custom-templates-para-tu-archivo-de-custom-posts-types)
    -   [Fragmento de código para un archive.php básico](#fragmento-de-c-digo-para-un-archivephp-b-sico)
    -   [archive.php con get_template_part()](#archivephp-con-get-template-part--)
-   [Crear custom templates para tus custom posts types](#crear-custom-templates-para-tus-custom-posts-types)
-   [Crear custom gutenberg blocks](#crear-custom-gutenberg-blocks)
    -   [Register block type](#register-block-type)
    -   [Código básico de bloque que viene con el paquete](#c-digo-b-sico-de-bloque-que-viene-con-el-paquete)
    -   [Nueva estructura](#nueva-estructura)
    -   [Código de una manera más simple](#c-digo-de-una-manera-m-s-simple)
        -   [index.js](#indexjs)
        -   [editor.js](#editorjs)
    -   [Añadir un CGB dentro de un custom type](#a-adir-un-cgb-dentro-de-un-custom-type)
        -   [bloque](#bloque--registerblocktype---cgb-block-custom-gutenberg-blocks-----args---)
        -   [custom type](#custom-type---template-----array-array--cgb-block-custom-gutenberg-blocks----)
    -   [Categoría propia para un conjunto de CGB](#categor-a-propia-para-un-conjunto-de-cgb)
-   [CGB complejos](#cgb-complejos)
    -   [Compose](#compose)
        -   [withSelect](#withselect)
        -   [withDispatch](#withdispatch)
    *   [Leer datos del API de WP en nuestro CGB](#leer-datos-del-api-de-wp-en-nuestro-cgb)
        -   [Lista de gutenberg core blocks](#lista-de-gutenberg-core-blocks)
-   [Fuentes](#fuentes)

# <center> Crear un sitio Wordpress desde 0</center>

##### <center> (Tema personalizado, custom post types, custom gutenberg blocks, y más!) </center>

Ahora veremos un sencillo paso a paso sobre cómo vamos a crear rápidamente un sitio wordpress de manera local (suponiendo que tenemos xampp instalado en nuestro pc y tenemos manejo básico sobre algunas cosas sencillas de programación)

1.  Descargo wordpress https://es-ar.wordpress.org/download/#download-install
2.  Corro Xampp e inicio tanto Apache como MySQL
3.  Dirigirse a su sitio local (en mi caso http://localhost/wp-admin ) y configurar el admin
    - Si tengo problemas con la base de datos, puedo ir a /phpmyadmin , hacer un drop y levantarla de nuevo
    - Por defecto la base de datos se accede con user root y una pass vacía desde nuestro archivo `wp-config.php`
        ```
        /** MySQL database username */
        define( 'DB_USER', 'root' );

        /** MySQL database password */
        define( 'DB_PASSWORD', '' );
        ```
4.  Descargo un tema vacío https://underscores.me/ ( esto nos va a dar la estructura con las carpetas y archivos armados y algunas configuraciones básicas)
    - En cualquier caso y/o momento podemos descargar un tema desarrollado por terceros y utilizarlo sin ningún problema, pudiendo igualmente aplicar contenido de esta guía como creación de plugins y gutemberg blocks.
    - Vamos a encontrar dentro de la carpeta themes `wp-content/themes` , varias carpetas con los temas que nos otorga wordpress por defecto. Es ahí donde vamos a pegar nuestra nueva carpeta.
    - El tema debemos seleccionarlo desde el administrador de wordpress en el apartado de apariencia.
5.  Agregar una carpeta stylesheet dentro del tema\*
6.  Agregar main.scss dentro de stylesheets\*
7.  Dentro de main.scss agregar un comentario con la información del tema

    - Si vamos a utilizar css en vez de sass este comentario va a ir dentro de nuestro archivo style.css

    ```
        /*!
            Example:
            Theme Name: New personalized Theme
            Theme URI: http://underscores.me/
            Author: Underscores.me
            Author URI: http://underscores.me/
            Description: Description
            Version: 1.0.0
            Tested up to: 5.4
            Requires PHP: 5.6
            License: GNU General Public License v2 or later
            License URI: LICENSE
            Text Domain: new-personalized-theme
            Tags: custom-background, custom-logo, custom-menu, featured-images, threaded-comments, translation-ready
            */
    ```

8.  Instala sass como dev dependency\*
9.  Agregar los scripts en el package.json para observar los archivos sass correspondientes\*

        ```
         "watch": "node-sass stylesheets/main.scss style.css --w --source-map false",
         "compile:css": "node-sass stylesheets/main.scss style.css --source-map false",
        ```

    > `*` Agregar archivos Sass y la configuración es sólo si queremos utilizar esta extensión de css, ya que podemos editar nuestro css sin utilizar la extensión directamente añadiendo estilos en el archivo style.css donde le pedimos a sass que compile !
    > Si vas a utilizar css plano, podes evitar esa configuración. ( pasos 6, 8 y 9 )

> Si vamos a utilizar un tema externo y no a crear uno propio , lo mejor es utilizar una carpeta "child-theme" dentro del mismo para hacer nuestras modificaciones y en este caso no vamos a modificar los archivos scss ni css de la carpeta del tema, sino que crearemos unos nuevos dentro de nuestro tema hijo

#### Capturas del administrador
##### Apariencia
![cgb-tutorial apariencia temas](/assets/wp-blank-theme.png)    
    
##### Información del tema nuevo
![cgb-tutorial tema información](/assets/wp-blank-theme-data.png)


# Crear un custom plugin

<!-- English version -->
<!-- > A site-specific WordPress plugin is a standalone plugin that you can use to add all customization snippets that are not theme dependent.
If you add the custom code to your theme’s functions file, then it will disappear if you update or switch your theme. You can create a child theme and use the child theme’s functions file to save your code. However, your code will still disappear if you switch themes. -->

> Un plugin específico de WordPress es un plugin independiente, que podemos utilizar para agregar fragmentos de código y personalización que no van a depender del tema.
> Si agregamos el código "personalizado" en el archivo functions.php este código desaparecería al cambiar de tema o quizá al actualizar un tema que estamos utilizando.
> Podemos crear un "child-theme" y usar ese archivo de funciones en el hijo para guardar el código lo que evitaría la pérdida cuando se actualice un tema pero todavía si cambiaramos el mismo por otro estaríamos perdiendo todo este código personalizado

1. Crear una capeta para nuestro nuevo plug-in `my-new-plugin` (podemos usar el nombre que creamos conveniente) dentro de la ruta `wordpress/wp-content/plugins`
2. Dentro de nuestra nueva carpeta vamos a crear un archivo con extensión `.php` (nuevamente, podés utilizar el nombre que creas conveniente y representativo) para que WordPress reconozca nuestro plugin
3. En el archivo que hemos creado tenemos que escribir el siguiente código :

    ```
    <?php
    /*
    Plugin Name: Site Plugin for yoursite.com
    Description: Site specific code changes for yoursite.com
    */
    /* Start Adding Functions Below this Line */

    /* Stop Adding Functions Below this Line */
    ?>
    ```

4. Activamos el plugin dentro de nuestro administrador de Wordpress

Y así de facil ya tenemos un plugin creado listo para empezar a meterle funcionalidades , en este caso no hará nada ya que nuestro archivo solo tendrá la configuración básica y nada de contenido.

#### Capturas del administrador
##### Plugins
![cgb-tutorial plugins](/assets/wp-new-plugin.png)    
# Crear custom types

#### Consideraciones previas

-   Previamente debemos tener un proyecto de wordpress creado y funcionando
-   Puede hacerse indistintamente del theme que vayamos a usar
-   Previamente tenemos que haber creado un custom plugin (opcional)
-   Si no tenemos creado un plugin , procederemos en el archivo `functions.php`

    -   Argumentos para elegir crear un plugin o hacerlo directo sobre el archivo `functions.php`
         <!-- English version -->
         <!-- > **Plugins argument**: The user will always have the data even if they change the theme. It might not look as pretty, but it will stay there.  
         > **Functions.php Argument**: Data without design would be irrelevant. It will confuse users even more. -->

        > **Argumento para usar plugin** : El usuario siempre mantendrá los datos, incluso si cambia el tema. Probablemente esta información no se verá atractiva pero no la perdería y podría volver a estilizar su nuevo tema.
        > **Argumentos para usar functions.php** : La información sin diseño puede ser irrelevante e incluso confundir a los usuarios un poco.

> Ambos son argumentos válidos, pero es de mi preferencia mantenerlos separados del theme por si este se ve modificado o reemplazado más adelante.

1.  Vamos a escribir el siguiente código dentro del archivo que hayamos elegido previamente (functions.php o nuestro plugin personal)

        ##### Fragmento de código para nuestro nuevo post type

            ```
            // Our custom post type function
            function create_posttype() {

                register_post_type( 'movies',
                // CPT Options
                    array(
                        'labels' => array(
                            'name' => __( 'Movies' ),
                            'singular_name' => __( 'Movie' )
                        ),
                        'public' => true,
                        'has_archive' => true,
                        'rewrite' => array('slug' => 'movies'),
                        'show_in_rest' => true,

                    )
                );
            }
            // Hooking up our function to theme setup
            add_action( 'init', 'create_posttype' );
            ```

    <!-- English version -->
    <!-- > What this code does is that it registers a post type 'movies' with an array of arguments. These arguments are the options of our custom post type.
    This array has two parts, the first part is labeled, which itself is an array. The second part contains other arguments like public visibility, has archive, slug, and show_in_rest enables block editor support.
    More options can be added to this custom type ! [Developer WordPress - Register post type ](https://developer.wordpress.org/reference/functions/register_post_type/ "see more information") -->

> Lo que este codigo hace es registrar un nuevo **post-type** llamado 'movies' que tiene un array de argumentos.
> Estos argumentos están separados en dos partes, la primer parte está etiquetada y al mismo tiempo es un array. La segunda parte contiene otros argumentos como visibility, has archive, slug, y show_in_rest habilita la copmpatibilidad con el editor de bloques (editor de gutenberg).
> Hay muchos argumentos que todavía podemos añadir a nuestro custom post type podemos ver un poco mas de información en : [Developer WordPress - Register post type ](https://developer.wordpress.org/reference/functions/register_post_type/ "see more information")

2. Para definir bloques específicos que queremos que aparezcan en nuestro post type tenemos que definir la propiedad 'template' como un array de bloques que contenga dentro también un array por cada bloque con el nombre y sus propiedades. `'template' => array(array('core/image'))`  
    1 También podemos colocar varias veces el mismo block `'template' => array(array('core/image', array('core/image') ) `
3. Bloquear el template de bloques con `'template_lock' =>` 
    3. 1 `true` bloquearemos el template a la inclusión de nuevos bloques pero no la planilla total por lo que los usuarios podrán moverlos y acomodarlos a gusto 
    3. 2 `all` bloquearemos el template y sólo se podrá editar el contenido de los bloques pero no podrán agregar nuevos bloques ni acomodarlos 
    3. 3 `false` el template es un lienzo vacío que puede agregar o eliminar bloques a su gusto
4. Ahora ya podemos mostrar nuestro nuevo custom post type en el sitio como creamos conveniente (podemos crear templates que carguen todos los types y/o para un single de cada type en nuestro tema custom o simplemente utilizar los que el tema utilizado nos otorgue)

> Si no queremos tener un archivo de este post type debemos setear has_archive => false

#### Capturas del administrador
##### Custom post type
![cgb-tutorial custom post type](/assets/wp-movies-custom-post-type.png) 
### Agregar información adicional en tu cabecera del post

> Esto es útil para información importante, links o ayudas

Podemos agregar información adicional en la sección superior de la pestaña de nuestro post type. Cuando entras al post type arriba aparecerá una pestaña desplegable de ayuda y ahí dentro vas a poder agregar contenido que creas útil para el usuario que deba manipular ese post type específico.

```
add_action('admin_head', function() {
    $screen = get_current_screen();

    if ( 'movies' != $screen->post_type )
        return;

    $args = [
        'id'      => 'movies_info',
        'title'   => 'Movies Information',
        'content' => '<h3>Movies template posts</h3><p>Here you can create edit and delete your "Movies" posts</p>',
    ];

    $screen->add_help_tab( $args );
});
```

Si queremos agregar más tabs en nuestra sección de ayuda podemos simplemente crear otros array de argumentos y re declarar la función `add_help_tab` con los nuevos argumentos, una debajo de la otra

~~~
$args1 = [ ... ]
$args2 = [ ... ]

$screen->add_help_tab( $args1 );
$screen->add_help_tab( $args2 );
~~~

#### Capturas del administrador
##### Help tab
![cgb-tutorial custom post type help tab](/assets/wp-movies-help-tab.png) 
### Categorias y etiquetas

Probablemente necesites utilizar etiquetas y/o categorias para mostrar o entrelazar los post types entre si , buscar información y agruparla.  
En este caso podemos agregar el argumento 'taxonomies' y pasarle como valor un array que especifique el tipo que vamos a mostar/utilizar, en este caso wordpress tiene como default los tags y las categorias (pero no perdamos de vista que igualmente podemos crear taxonomies personalizadas).
El argumento básico será el siguiente :

```
'taxonomies' => array( 'post_tag','category' ) // add taxonomies , this enable the box categories and tags to select them
```
Ahora bien, una taxonomía es básicamente la forma que nos da wordpress para poder agrupar nuestro contenido y como mencioné anteriormente podemos crear nuestra propia taxonomía y asignarla a nuestro post type!
Ahora veamos como : 

```
function new_taxonomy()
{
    register_taxonomy(
        'movies-category', // name for this taxonomy
        'movies', // cpt or array of cpt slugs where tax need to be placed
        array(
            'labels'            => array(
                'name'              => 'Movies',
                'singular_name'     => 'Movie'
            ),
            'show-ui'           => true,
            'show-tag-cloud'    => false,
            'hierarchical'      => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
        )
    );
};
add_action('init', 'new_taxonomy');
```
Con esta simple función lo que hicimos fue crear una nueva taxonomía para nuestro sitio llamada Movies la cual puede agrupar nuestro nuevo post type o los posts por defecto de wordpres 

> Las taxonomías son accesibles al momento de crear un nuevo cpt , es decir que podemos agregarlo con la propiedad `taxonomies` dentro de nuestro post type. 
'taxonomies' => array( 'post_tag','category','movies )

>La creación de una taxonomía requiere al menos un post type base donde colocarse, esta función acepta otros argumentos que podemos encontrar en la pagina para desarrolladores de wordpress.

#### Capturas del administrador
##### Custom Taxonomy
![cgb-tutorial custom post type help tab](/assets/wp-new-taxonomy.png) 
##### Add Taxonomy
![cgb-tutorial custom post type help tab](/assets/wp-add-tax-on-post.png)
# Esconder o eliminar un default post type

Llegado a este punto abremos configurado nuestros propios custom post types, y puede que llegado el caso querramos que el usuario final pueda agregar y/o modificar únicamente los nuevos post types que nosotros creamos. Es aquí donde surge la pregunta, puedo eliminar u ocultar el post type por default ? La respuesta es , si.
Ahora veamos como, ya que vamos a tener que agregar 3 hooks para hacerlo definitivamente.

### Menú lateral

```
add_action( 'admin_menu', 'remove_default_post_type' );

function remove_default_post_type() {
    remove_menu_page( 'edit.php' );
}
```

### Admin bar

#### The "+" New post

```
add_action( 'admin_bar_menu', 'remove_default_post_type_menu_bar', 999 );

function remove_default_post_type_menu_bar( $wp_admin_bar ) {
    $wp_admin_bar->remove_node( 'new-post' );
}
```

#### The "+" New Link

```
function remove_add_new_post_href_in_admin_bar() {
    ?>
    <script type="text/javascript">
        function remove_add_new_post_href_in_admin_bar() {
            var add_new = document.getElementById('wp-admin-bar-new-content');
            if(!add_new) return;
            var add_new_a = add_new.getElementsByTagName('a')[0];
            if(add_new_a) add_new_a.setAttribute('href','#!');
        }
        remove_add_new_post_href_in_admin_bar();
    </script>
    <?php
}
add_action( 'admin_footer', 'remove_add_new_post_href_in_admin_bar' );


function remove_frontend_post_href(){
    if( is_user_logged_in() ) {
        add_action( 'wp_footer', 'remove_add_new_post_href_in_admin_bar' );
    }
}
add_action( 'init', 'remove_frontend_post_href' );
```

### The Quick Draft Dashboard Widget

```
add_action( 'wp_dashboard_setup', 'remove_draft_widget', 999 );

function remove_draft_widget(){
    remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
}
```

> De todas maneras hay que ser conscientes de que esto puede seguir siendo accesible vía url

# Crear custom templates para tu archivo de custom posts types

Suponiendo que no te gusta la manera en la que Wordpress y el tema elegido muestran el archivo de tu post type o si estamos creando nuestro propio tema podemos modificar esto creando un template dedicado a cada archivo de post type de maneras simples.  
Para empezar vas a crear en la raiz del tema un archivo con el nombre de tu post type y extensión php `archive-movies.php` (movies será reemplazado por el nombre de tu custom post type y archive será siempre el path inicial). El contenido de este archivo podemos inicializarlo simplemente copiando el código que encontramos en `archive.php` y luego ir modificandolo para adaptarlo a nuestras necesidades.

##### Fragmento de código para un archive.php básico

```
<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Personalized_Theme
 */

get_header();
?>

	<main id="primary" class="site-main movie-archive-wrapper">

		<?php if ( have_posts() ) : ?>

			<header class="page-header">
				<?php
				the_archive_title( '<h1 class="page-title movie-archive">', '</h1>' );
				the_archive_description( '<div class="archive-description">', '</div>' );
				?>
			</header><!-- .page-header -->

			<?php
			echo '<div class="movie-posts-wrapper">';
			/* Start the Loop */
			while ( have_posts() ) :

				the_post();
				echo '<div class="single-post">';

				echo '<div class="single-post-title">';
				the_title();
				echo '</div>';

				echo '<div class="single-post-archive">';
				the_content();
				echo '</div>';

				echo '</div>';

			endwhile;
			echo '</div>';
			the_posts_navigation();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();

```

#### archive.php con get_template_part()

Esta función nos permite definir otro archivo dentro de la carpeta template parts donde vamos a poder definir de que manera mostrar por separado cada uno de los datos.
En el siguiente fragmento de código podemos ver cual sería la estructura para utilizar los template-parts

```
<div class="products-list-wrapper">
	<?php if (have_posts()) :
		while (have_posts()) :
			the_post();
			get_template_part('template-parts/content', get_post_type());
		endwhile;
	else :
		get_template_part('template-parts/content', 'none');
	endif;
	wp_reset_query();
	?>
</div>
```

De esta manera pasamos a definir cada objeto del archive de tus nuevos post dentro de un nuevo documento de extensión `.php` que, como dijimos anteriormente, va a ir ubicado dentro de la carpeta template-parts y va a tener como nombre `content-movie.php` (movie será reemplazado por el nombre de tu custom post type e irá en la forma singular además content será siempre el path inicial) el contenido de este archivo podemos iniciarlo tomando como ejemplo base el `content.php`

Los archivos de tus post types van a mostrar un cupo **limitado** de tus post, según lo que tengan marcado dentro de "Ajustes>Ajustes de lectura" que generalmente es 10.
El problema con esta funcionalidad es que muchas veces podemos querer modificar la cantidad de post para cada archivo, por ejemplo queremos mostrar 20 peliculas en un archivo de peliculas pero sólo 5 cines en un archivo de cines.  
En este caso lo que podemos hacer es usar el hook "pre_get_posts"

> Para diferenciar al archive de nuestros post con nuestro post singular en la carpeta template-parts debemos utilizar la función is_archive() que nos va a indicar que estamos trabajando sobre el post general o el archivo

> Ver más [Typerocket - Ultimate guide to custom post types ](https://typerocket.com/ultimate-guide-to-custom-post-types-in-wordpress/)

# Crear custom templates para tus custom posts types

De igual manera que con el archivo podemos crear templates para cada uno de estos post types individuales.
Como vimos con el archivo de las custom post types también vamos a encontrarnos un archivo llamado `sinlge.php` que nos va a servir de base para nuestro nuevo template.
Lo que tenemos que hacer es crear este archivo como `single-movies.php` (movies será reemplazado por el nombre de tu custom post type donde single será siempre el path inicial)

> Recordar que estos archivos se crean en la raíz de nuestro tema

# Crear custom gutenberg blocks

Para crear nuestros propios custom gutenberg blocks (CGB) vamos a armar un "plugin" y vamos a ayudarnos de un paquete npm nos dará la estructura base del mismo y a partir de allí podremos crear nuestros propios bloques.
Mis agradecimientos a Ahmadawais por crear esta _dev-tooltip_ que nos permite crear bloques en minutos sin tener que configurar webpack, React y demás, haciendo nuestro trabajo mucho más sencillo !

> [Ahmadawais - Create a custom block](https://github.com/ahmadawais/create-guten-block) >[Ahmadawais - Github profile](https://github.com/ahmadawais)

Dentro de nuestra carpeta plugin vamos a correr el comando

```
npx create-guten-block my-block
```

Lo cual creará nuestro nuevo bloque y la estructura necesaria para que estos puedan fucionar, cabe destacar que estos bloques son creados como componentes de React.js y que wordpress presta componentes propios para algunas funcionalidades (como si de ReactNative.js se tratase)

El bloque base que nos otorgará este paquete npx consta de un archivo base de javascript con la configuración del bloque y dentro del mismo podemos ver dos funciones que reciben propiedades, estas funciones son _edit_ y _save_ cada una de ellas va a servirnos para editar el bloque dentro de nuestro cms con WordPress o para mostrar el contenido en nuestro frontend.
Ahora bien , veamos en detalle este componente block.js !

#### Register block type

> `registerBlockType ($name, $args)`

Con esta función vamos a registrar nuestro nuevo bloque de gutenberg y retornarlo tanto al cms como al frontend. Esta función la tenemos que importar de "wp.blocks"

```
const { registerBlockType } = wp.blocks;
    ó
Import registerBlockType() from wp.blocks
```

`$name` es una variable que debe ser un string que contenga el prefijo de nuestro conjunto de bloques por ejemplo "my-plugin/my-custom-block"
`$args` en los argumentos vamos a tener la configuración básica del bloque como el nombre, el icono, y a que categoría pertenece, pero además vamos a encontrar las funciones de edit y save de las que hablamos previamente que no van a hacer otra cosa que recibir propiedades y devolver un jsx de React.

En una versión previa, tus archivos .scss ( css ) modificaban unicamente al componente del editor, lo cual hacía muy dificil mantenerlos ya que teniamos que editar los estilos en el template para poder modificar la vista del frontend. Ahora esto se pudo simplificar y vamos a tener dos listas de archivos Sass un editor.scss que como su nombre lo indica va a estar modificando la planilla del CGB para el editor y un style.scss que va a modificar la vista en el frontend de nuestra web.
El archivo style modifica ambos componentes, pero jerárquicamente el archivo editor tiene mas fuerza y por eso va a modificar lo estilos unicamente para nuestro bloque del editor.

### Código básico de bloque que viene con el paquete

```
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

registerBlockType( 'cgb/block-custom-gutenberg-blocks', {
	title: __( 'custom-gutenberg-blocks - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'cricut', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'custom-gutenberg-blocks — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],

	edit: ( props ) => {
		// Creates a <p class='wp-block-cgb-block-custom-gutenberg-blocks'></p>.
		return (
			<div className={ props.className }>
				<p>— Hello from the backend.</p>
			</div>
		);
	},
	save: ( props ) => {
		return (
			<div className={ props.className }>
				<p>— Hello from the frontend.</p>
			</div>
		);
	},
} );
```

Ahora, si ya conocemos la librería de React, se nos hace un poco extraño no tener separados los componentes en diferentes archivos... pero tranquilos !
Podemos hacerlo ( siempre y cuando no utilicemos mayúsculas en el nombre de los archivos .js o .scss )

### Nueva estructura

:file_folder: New Block
┣ :file_folder:Block
┃ ┗ :page_facing_up:block.js
┃ ┗ :page_facing_up:style.scss
┣ :file_folder:Editor
┃ ┗ :page_facing_up:editor.js
┃ ┗ :page_facing_up:editor.scss
┣ :page_facing_up:index.js

### Código de una manera más simple

> Los archivos editor.js y block.js se verían de una manera muy similar, para este ejemplo mostraré solo el componente editor

#### index.js

```
    import Editor from './Editor/editor';
    import Block from './Block/block';

    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;

    registerBlockType( 'cgb/block-cgb', {
        title: __( 'cgb - CGB Block' ),
        icon: 'shield',
        category: 'cricut',
        keywords: [
            __( 'cgb — CGB Block' ),
            __( 'CGB Example' ),
            __( 'create-guten-block' ),
        ],

        edit: ( props ) => <Editor {...props} />,

        save: ( props ) => <Block {...props} />,
    } );
```

#### editor.js

```
    import './editor.scss';

    const Editor = props => {
        return (
            <div className="my-block-editor">
                <p>Hello from the backend.</p>
            </div>
        );
    }

    export default Editor;
```

### Añadir un CGB dentro de un custom type

Los custom gutenberg blocks son accesibles dentro de cualquier post, page o type que pueda agregar nuevos bloques. Pero hay casos en los que definimos los bloques que se pueden agregar a cada custom post type, en ese caso para agregar como bloque definido dentro de un custom post type, vamos a tener que añadirlo siguiendo la "ruta" que declaramos en el bloque propio.

##### bloque `registerBlockType( 'cgb/block-custom-gutenberg-blocks', {$args})`

##### custom type `'template' => array(array('cgb/block-custom-gutenberg-blocks'))`

### Categoría propia para un conjunto de CGB

Podemos crear categorías completamente nuevas para nuestros gutenberg blocks agregando en nuestro plugin creado para añadir custom snippets o en el archivo `functions.php` el siguiente código :

```
function my_custom_block_categories( $categories, $post ) {
    if ( $post->post_type !== 'post' ) {
        return $categories;
    }
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'cgb', //slug to identify this in block creation
                'title' => __( 'Custom blocks', 'custom-blocks' ), // category title
                'icon'  => 'wordpress', // icon for category
            ),
        )
    );
}

add_filter( 'block_categories', 'my_custom_block_categories', 10, 2 );
```

Luego dentro de nuestro bloque podemos agregar en la seccion category nuestro slug y listo, así de sencillo tenemos el bloque dentro de una categoría propia.

> Con el if(){...} inicial lo que estamos haciendo es limitar esta categoría a nuestro type de post especifico... en este caso a post que es el default de wordpress. También podemos eliminar esa validación si queremos que esté accesible en todo el sitio

<!-- Inside of src/init.php add array('wp-blocks', 'wp-plugins', 'wp-element', 'wp-edit-post', 'wp-editor', 'wp-data') line 43 -->

# CGB complejos

Cómo vimos anteriormente crear nuestros propios CGB no es algo muy complicado, y con algunas configuraciones podemos tener nuestros CGB funcionando facilmente.
Ahora llegó el momento de agregar funcionalidades más complejas a los bloques, desde el manejo de información o "states" entre block y editor hasta el manejo de información entre wordpress y nuestros cgb permitiendo modificar o utilizar atributos como las taxonomies, el titulo etc.

### Compose

[Developer wordpress - Compose](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/#compose)

Compose es en palabras sencillas un HOC (high order component) que contiene varios de ellos en un mismo componente.
Realiza una composición de funciones "right-to-left" donde a cada invocación se le proporciona el valor que retorna la funcion anterior.

```
compose(array)(component)
```

Vamos a pasar un array como parámetro de compose que puede estar compuesto por las llamadas a las funciones como `withSelect` y `withDispatch` (las cuales proporcionarán la logica necesaria para manipular datos propios de wordpress y no sólo de nuestro bloque en específico) junto con nuestro componente.
Nuestro componente puede tener acceso a las acciones y selectores que nosotros definamos dentro de dicho compose.

#### withSelect

Es un HOC que usamos para pasar datos como "props" desde nuestro almacenamiento de datos seleccionado a nuestro componente.

<!-- English version -->
<!-- This is a higher-order component that we use to pass data as props from the selected data store to our component. -->

#### withDispatch

Es un HOC que usamos para pasar funciones de envío como propiedades desde nuestro almacenamiento de datos seleccionado a nuestro componente.

<!-- English version -->
<!-- This is a higher-order component that we use to pass dispatch functions as props from the selected data store to our component. -->

## Leer datos del API de WP en nuestro CGB

Como vimos anteriormente vamos a necesitar hacer uso de `compose` y el hoc `withSelect`.
Primeramente vamos a tener que "envolver" nuestro componente en compose y en este caso como vamos a leer y no modificar datos sólo vamos a utilizar `withSelect` quien va a recibir como parametro `select` y dentro del mismo podremos utilizar los metodos que necesitemos del objeto otenido con el metodo select.
####Vamos a ver un esto como código para tratar de entenderlo mejor.
Supongamos que tenemos nuestro componente base `editor.js` donde queremos utilizar el título de nuestro post type como texto a mostrar en un párrafo de nuestro CGB en el editor.

Editor.js con el componente básico

```
const Editor = (props) => {
	return (
        <p>Add title from post title here : $title</p>
    );
}

export default Editor;
```

En este caso vamos a agregar nuestro HOC compose para poder hacernos del dato que necesitamos, modificando ligeramente el nombre de nuestro componente inicial para pasarlo en nuestro compose y retornar el componente Editor a partir de la utilización de compose.

```
const EditorCompose = (props) => {
	return (
        <p>Add title from post title here : $title</p>
    );
}

const Editor = compose([
    withSelect((select) => {
		...
	}),
])(EditorCompose)

export default Editor;
```

Ahí mismo vemos que hacemos uso de withSelect y le pasamos como parametro la función select que nos va a permitir seleccionar de dónde necesitamos extraer los datos.
Ahora miremos un poco más en profundidad este HOC withSelect

```
withSelect((select) => {
		const editorSelect = select('core/editor')
		const title = editorSelect.getEditedPostAttribute("title");
		return {
			title
		};
	}),
```

En él podemos ver como definimos a dónde vamos a ir a buscar estos datos lo cual nos va a devolver un objeto con diferentes propiedades que nos van a permitir por ejemplo hacer un `get` al current post usando cierto atributo como en este caso.

> Podemos definir una constante con nuestro select o hacerlo donde lo requiramos nosotros, eso es a tu preferencia

En este caso estamos yendo a buscar la información al `core/editor` y le estamos pidiendo que nos entregue el valor del atributo "title" `select('core/editor').getCurrentPostAttribute("title")` y lo estamos retornando logrando así tener este atributo como propiedad dentro de nuestro comoponente principal

```
const EditorCompose = (props) => {
	return (
        <p>Add title from post title here : {props.title}</p> //now we have props.title with post type title
    );
}

const Editor = compose([
    withSelect((select) => {
		const editorSelect = select('core/editor')
		const title = editorSelect.getEditedPostAttribute("title");
		return {
			title
		};
	}),
])(EditorCompose)

export default Editor;
```
## Editar datos del API de WP en nuestro CGB

Una vez que vimos como leer los datos del API también nos puede surgier la necesidad o curiosidad de querer escribir por ejemplo en un input y modificar nuestros datos como el títiulo de la página el cual va a ser además quien arma el slug básico.
En ese caso vamos a hacer uso del `withDispach` que nos permitirá enviar los datos que querramos modificar a nuestro sitio de WordPress.

Vamos a continuar con el ejemplo anterior para poder mostrar como funciona esto y vamos a crear una función setTitle que sea accesible desde nuestro editor y pueda modificar el title del post type.

```
const EditorCompose = (props) => {

	return (
        <p>Add title from post title here : {props.title}</p> //now we have props.title with post type title
        <TextControl value={props.postTitle} onChange={(title) => setTitle(title)} placeholder="Insert your title"	/>
    );
}

const Editor = compose([
    withSelect((select) => {...}),

    withDispatch((dispatch) => ({
		setTitle(title) {
			dispatch("core/editor").editPost({ title });
		},
	})),

])(EditorCompose)

export default Editor;
```

Como vemos en el ejemplo lo que estamos haciendo es crear una funcion dentro de nuestro `withDispatch` que va a enviar el titulo mediante el dispatch al `core/editor` con su propiedad editPost el nuevo título denuestro post y esta función va a ser accesible como una propiedad de nuestro componente editor.
> Los modulos core , y core/editor son propios de wordpress. Para más información visitar [Developers Wordpress - data](https://developer.wordpress.org/block-editor/reference-guides/data/)
### Lista de gutenberg core blocks

```
archives
audio
button
categories
code
column
columns
coverImage
embed
file
freeform
gallery
heading
html
image
latestComments
latestPosts
list
more
nextpage
paragraph
preformatted
pullquote
quote
reusableBlock
separator
shortcode
spacer
subhead
table
textColumns
verse
video
```

# FUENTES

Mi mayor agradecimiento a los creadores de los siguientes contenidos , fueron de mucha ayuda para la creación de esta guía.

> [Underscores - Create wp base theme](http://underscores.me/)  
> [Wordpress - Download basic wordpress](https://es-ar.wordpress.org/download/#download-install)  
> [Developer wordpress - Child theme ](https://developer.wordpress.org/themes/advanced-topics/child-themes/) 
>[Developer wordpress - Register post type functions](https://developer.wordpress.org/reference/functions/register_post_type/)  
> [Developer wordpress - Register block type](https://developer.wordpress.org/reference/functions/register_block_type/)
>[Developer wordpress - Icons ](https://developer.wordpress.org/resource/dashicons/)  
> [Developer wordpress - Components](https://developer.wordpress.org/block-editor/reference-guides/components/)
> [Developer wordpress - Compose](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/#compose)    
>[Developers Wordpress - Block editor data](https://developer.wordpress.org/block-editor/reference-guides/data/)
>[Developers Wordpress - Register taxonomy](https://developer.wordpress.org/reference/functions/register_taxonomy/)    
> [Wpbeginner - Creating a wordpress plugin](https://www.wpbeginner.com/beginners-guide/what-why-and-how-tos-of-creating-a-site-specific-wordpress-plugin/)  
> [Wpbeginner - Create a custom post types archive page in wordpress](https://www.wpbeginner.com/wp-tutorials/how-to-create-a-custom-post-types-archive-page-in-wordpress/)  
> [Wpbeginner - Permalink settings](https://www.wpbeginner.com/wp-tutorials/seo-friendly-url-structure-for-wordpress/)  
> [Awhitepixel - Control blocks in post types](https://awhitepixel.com/blog/wordpress-gutenberg-control-blocks-remove-and-block-templates/)  
> [Typerocket - Ultimate guide to custom post types ](https://typerocket.com/ultimate-guide-to-custom-post-types-in-wordpress/)  
> [Ahmadawais - Create a custom block](https://github.com/ahmadawais/create-guten-block) >[Ahmadawais - Github profile](https://github.com/ahmadawais)
> [Markdown - Sintax](https://www.markdownguide.org/basic-syntax/)
> [Kinsta - qué es una taxonomía](https://kinsta.com/es/base-de-conocimiento/que-es-una-taxonomia/)
