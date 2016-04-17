
==================================================
类图
==================================================

Slider类图
|
|
|----成员变量                                                                      		
|    |
|    |--active                    			-- 用于记录当前轮播图位置               					
     |
     |
     |--items                               -- 轮播图Dom对象的数组                         					
     |
     |--next                                -- 轮播图后退按钮                     					
     |
     |--prev                                -- 轮播图前进按钮                					
     |
     |--lis                                 -- 轮播图控制按钮                    					
     |
     |
     |--context                             -- 构造入参数:轮播图对应的上下文环境                    					
     |
     |--options                             -- 构造入参数:轮播图配置项  
     |
     |--autoSlide                           -- 轮播图配置项 :是否自动轮播(false|true)   
     |
     |--slideInterval                       -- 轮播图配置项 :轮播间隔(ms)  
     |
     |--sliderEffect                        -- 轮播图配置项 :轮播效果(slide|fadeout) 
     |
     |
     |--timer                               -- 轮播图内部使用,用于记录定时器ID
     |
     |--clickName                           -- 轮播图内部使用,用于区分按钮点击类型
|                       					
|
|----成员方法
|    |	
|	 |--constructor(context, options)       -- 轮播图构造函数,入参:轮播图Dom对象和配置项options
	 |
	 |
	 |--setActiveSlide(slider)              -- 设置slider为当前轮播图
	 |
     |--sliderWillSlide(now, next)          -- 轮播图事件监听,轮播图开始轮播时触发
	 |
     |--sliderDidSlide(now, prev)           -- 轮播图事件监听,轮播图结束轮播时触发
     |
     |
     |--getActiveSlideIndex()               -- 轮播图内部使用,获取当前轮播图索引
	 |
     |--getSlideByIndex(index)              -- 轮播图内部使用,根据索引获取轮播图的Dom对象
	 |
     |--getSlideLength()                    -- 轮播图内部使用,轮播图的长度
     |
     |
     |--on(type, callback)                  -- 轮播图内部使用,用于注册事件
	 |
     |--trigger(type)                       -- 轮播图内部使用,用于触发事件

DOM类图 
|--each(obj)                                -- 静态方法,遍历元素或数组         					    
|
|----prototype对象                                                                      -- 实现jQuery的部分功能
     |
     |--addClass()                          -- 给Dom元素添加类名                       					
     |
     |--removeClass()                       -- 给Dom元素移除类名                        					
     |
     |--hasClass()                          -- 判断Dom元素是否拥有类名                  					
     |
     |
     |--getEvent(event)                     -- 获取事件对象  
     |
     |--addHandler(type,handler)            -- 给Dom元素绑定事件  
     |
     |--removeHandler(type,handler)         -- 取消Dom元素事件   
     |
     |--preventDefault(event)               -- 阻止默认事件 
     |
     |--stopPropagation(event)              -- 停止冒泡 
