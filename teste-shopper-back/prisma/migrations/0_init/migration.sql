��- -   C r e a t e T a b l e 
 
 C R E A T E   T A B L E   ` p a c k s `   ( 
 
         ` i d `   B I G I N T   N O T   N U L L   A U T O _ I N C R E M E N T , 
 
         ` p a c k _ i d `   B I G I N T   N O T   N U L L , 
 
         ` p r o d u c t _ i d `   B I G I N T   N O T   N U L L , 
 
         ` q t y `   B I G I N T   N O T   N U L L , 
 
 
 
         I N D E X   ` p a c k _ i d ` ( ` p a c k _ i d ` ) , 
 
         I N D E X   ` p r o d u c t _ i d ` ( ` p r o d u c t _ i d ` ) , 
 
         P R I M A R Y   K E Y   ( ` i d ` ) 
 
 )   D E F A U L T   C H A R A C T E R   S E T   u t f 8 m b 4   C O L L A T E   u t f 8 m b 4 _ u n i c o d e _ c i ; 
 
 
 
 - -   C r e a t e T a b l e 
 
 C R E A T E   T A B L E   ` p r o d u c t s `   ( 
 
         ` c o d e `   B I G I N T   N O T   N U L L , 
 
         ` n a m e `   V A R C H A R ( 1 0 0 )   N O T   N U L L , 
 
         ` c o s t _ p r i c e `   D E C I M A L ( 9 ,   2 )   N O T   N U L L , 
 
         ` s a l e s _ p r i c e `   D E C I M A L ( 9 ,   2 )   N O T   N U L L , 
 
 
 
         P R I M A R Y   K E Y   ( ` c o d e ` ) 
 
 )   D E F A U L T   C H A R A C T E R   S E T   u t f 8 m b 4   C O L L A T E   u t f 8 m b 4 _ u n i c o d e _ c i ; 
 
 
 
 - -   A d d F o r e i g n K e y 
 
 A L T E R   T A B L E   ` p a c k s `   A D D   C O N S T R A I N T   ` p a c k s _ i b f k _ 1 `   F O R E I G N   K E Y   ( ` p a c k _ i d ` )   R E F E R E N C E S   ` p r o d u c t s ` ( ` c o d e ` )   O N   D E L E T E   R E S T R I C T   O N   U P D A T E   R E S T R I C T ; 
 
 
 
 - -   A d d F o r e i g n K e y 
 
 A L T E R   T A B L E   ` p a c k s `   A D D   C O N S T R A I N T   ` p a c k s _ i b f k _ 2 `   F O R E I G N   K E Y   ( ` p r o d u c t _ i d ` )   R E F E R E N C E S   ` p r o d u c t s ` ( ` c o d e ` )   O N   D E L E T E   R E S T R I C T   O N   U P D A T E   R E S T R I C T ; 
 
 
 
 